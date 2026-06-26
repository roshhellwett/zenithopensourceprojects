import { NextResponse } from "next/server";
import { ZENITH_SYSTEM_PROMPT, OFFLINE_RESPONSES } from "@/lib/ai-prompt";
import { isRateLimited, MAX_MESSAGE_LENGTH, MAX_HISTORY_DEPTH } from "@/lib/rate-limit";

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

    // Validate and sanitize each message
    const validSenders = new Set(["user", "bot", "assistant"]);
    const truncated = messages.length > MAX_HISTORY_DEPTH ? messages.slice(-MAX_HISTORY_DEPTH) : messages;
    const sanitizedMessages = truncated
      .filter(
        (m: unknown): m is { sender: string; content: string } =>
          typeof m === "object" &&
          m !== null &&
          typeof (m as Record<string, unknown>).sender === "string" &&
          validSenders.has((m as Record<string, unknown>).sender as string) &&
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

    // Retry loop with backoff
    const MAX_RETRIES = 2;
    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
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

        if (response.ok) {
          const data = await response.json();
          const botText =
            data.choices?.[0]?.message?.content ||
            "I couldn't process that request. Could you rephrase?";
          return NextResponse.json({ text: botText });
        }

        // Non-200 — log and retry unless it's a 4xx (client error)
        const errText = await response.text();
        console.error("Groq API error:", response.status, errText);

        if (response.status < 500) {
          return NextResponse.json({
            text: "The AI service encountered an error. Please try again in a moment.",
          });
        }

        // 5xx — fall through to retry
        lastError = new Error(`Groq ${response.status}: ${errText}`);
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        lastError = fetchError;

        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          return NextResponse.json({
            text: "The AI is taking too long to respond. Please try again.",
          });
        }

        // Network error — retry after backoff
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
      }
    }

    throw lastError;
  } catch (error: unknown) {
    console.error("API route error:", error);
    return NextResponse.json({
      text: "A network error occurred. Please check your connection and try again.",
    });
  }
}
