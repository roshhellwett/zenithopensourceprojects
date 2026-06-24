import { NextResponse } from "next/server";
import { ZENITH_SYSTEM_PROMPT, OFFLINE_RESPONSES } from "@/lib/ai-prompt";

// ── Rate Limiter (sliding window, per-IP) ──
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) rateLimitMap.delete(key);
    }
  }, 300_000);
}

// ── Input Validation Constants ──
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_DEPTH = 20;

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { text: "You're sending too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body: { messages?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { text: "Invalid request format." },
        { status: 400 }
      );
    }

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { text: "Invalid request — messages array required." },
        { status: 400 }
      );
    }

    // Validate message count
    if (messages.length > MAX_HISTORY_DEPTH) {
      return NextResponse.json(
        { text: "Conversation too long. Please start a new chat." },
        { status: 400 }
      );
    }

    // Validate and sanitize each message
    const sanitizedMessages = messages
      .filter(
        (m: unknown): m is { sender: string; content: string } =>
          typeof m === "object" &&
          m !== null &&
          typeof (m as Record<string, unknown>).sender === "string" &&
          typeof (m as Record<string, unknown>).content === "string"
      )
      .map((m) => ({
        sender: m.sender,
        content: m.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { text: "No valid messages provided." },
        { status: 400 }
      );
    }

    const key = process.env.GROQ_API_KEY;

    if (!key || key === "gsk_your_groq_api_key_here" || key.trim() === "") {
      return NextResponse.json({
        text: OFFLINE_RESPONSES[Math.floor(Math.random() * OFFLINE_RESPONSES.length)],
      });
    }

    // Build conversation history for Groq (OpenAI-compatible format)
    const chatMessages = [
      { role: "system" as const, content: ZENITH_SYSTEM_PROMPT },
      ...sanitizedMessages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    // Call Groq with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: chatMessages,
            temperature: 0.7,
            max_tokens: 1024,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error("Groq API error:", response.status, errText);
        return NextResponse.json({
          text: "The AI service encountered an error. Please try again in a moment.",
        });
      }

      const data = await response.json();
      const botText =
        data.choices?.[0]?.message?.content ||
        "I couldn't process that request. Could you rephrase?";
      return NextResponse.json({ text: botText });
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json({
          text: "The AI is taking too long to respond. Please try again.",
        });
      }
      throw fetchError;
    }
  } catch (error: unknown) {
    console.error("API route error:", error);
    return NextResponse.json({
      text: "A network error occurred. Please check your connection and try again.",
    });
  }
}
