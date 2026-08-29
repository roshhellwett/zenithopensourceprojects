import { NextResponse } from "next/server";
import { ZENITH_SYSTEM_PROMPT, OFFLINE_RESPONSES } from "@/lib/ai-prompt";
import { isRateLimited, MAX_MESSAGE_LENGTH, MAX_HISTORY_DEPTH } from "@/lib/rate-limit";

const VALID_SENDERS = new Set(["user", "bot", "assistant"]);

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

    // Validate Content-Type
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { text: "Content-Type must be application/json." },
        { status: 400 }
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
    const truncated = messages.length > MAX_HISTORY_DEPTH ? messages.slice(-MAX_HISTORY_DEPTH) : messages;
    const sanitizedMessages = truncated
      .filter(
        (m: unknown): m is { sender: string; content: string } =>
          typeof m === "object" &&
          m !== null &&
          typeof (m as Record<string, unknown>).sender === "string" &&
          VALID_SENDERS.has((m as Record<string, unknown>).sender as string) &&
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

    const CANDIDATE_MODELS = Array.from(
      new Set(
        [
          process.env.GROQ_MODEL,
          "openai/gpt-oss-120b",
          "qwen/qwen3.6-27b",
          "openai/gpt-oss-20b",
          "qwen/qwen3.5-27b",
        ].filter((m): m is string => Boolean(m && m.trim()))
      )
    );

    // Build conversation history for Groq (OpenAI-compatible format)
    const chatMessages = [
      { role: "system" as const, content: ZENITH_SYSTEM_PROMPT },
      ...sanitizedMessages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    let lastError: unknown;

    // Try candidate models in order (automatic failover on deprecation/rate-limit/server error)
    for (const model of CANDIDATE_MODELS) {
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
              model,
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

        const errText = await response.text();
        console.warn(`Groq model '${model}' error (${response.status}):`, errText);
        lastError = new Error(`Groq ${response.status} (${model}): ${errText}`);

        // If 400 (e.g. model decommissioned) or 404 or 429 (rate limit) or 5xx, continue to next model in cascade
        continue;
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        lastError = fetchError;

        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          return NextResponse.json({
            text: "The AI is taking too long to respond. Please try again.",
          }, {
            status: 408,
            headers: { "Retry-After": "10" },
          });
        }

        // Network error — try next fallback model
        continue;
      }
    }

    throw lastError || new Error("All Groq candidate models failed.");
  } catch (error: unknown) {
    console.error("API route error:", error);
    return NextResponse.json({
      text: "The AI service encountered an error. Please try again in a moment.",
    });
  }
}
