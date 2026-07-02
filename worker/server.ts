import express from "express";
import cors from "cors";
import { ZENITH_SYSTEM_PROMPT, OFFLINE_RESPONSES } from "./lib/ai-prompt";
import { isRateLimited, MAX_MESSAGE_LENGTH, MAX_HISTORY_DEPTH } from "./lib/rate-limit";

// ── Config ──
const PORT = (() => {
  const p = parseInt(process.env.PORT || "3001", 10);
  return isNaN(p) ? 3001 : p;
})();
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:3000", "http://localhost:5173", "https://roshhellwett.github.io"];

// ── App ──
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, false);
      // Validate localhost or exact matches
      const isLocalhost =
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "http://localhost" ||
        origin === "http://127.0.0.1";
      const stripPath = (url: string) => {
        try { return new URL(url).origin; } catch { return url; }
      };
      const isAllowed = ALLOWED_ORIGINS.some(
        (allowed) => origin === stripPath(allowed)
      );

      if (isLocalhost || isAllowed) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "1mb" }));

// ── Health Check ──
app.get("/", (_req, res) => {
  res.json({
    service: "zenith-ai-worker",
    status: "operational",
    groq: GROQ_API_KEY ? "configured" : "not_set",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ── Chat Endpoint ──
app.post("/api/ai/chat", async (req, res) => {
  try {
    // Rate limiting (by IP address)
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";

    if (isRateLimited(ip)) {
      return res.status(429).json({
        text: "You're sending too many requests. Please wait a moment and try again.",
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ text: "Invalid request — messages array required." });
    }

    // Validate conversation history depth
    if (messages.length > MAX_HISTORY_DEPTH) {
      return res.status(400).json({ text: "Conversation too long. Please start a new chat." });
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
      return res.status(400).json({ text: "No valid messages provided." });
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === "gsk_your_groq_api_key_here" || GROQ_API_KEY.trim() === "") {
      return res.json({
        text: OFFLINE_RESPONSES[Math.floor(Math.random() * OFFLINE_RESPONSES.length)],
      });
    }

    const chatMessages = [
      { role: "system" as const, content: ZENITH_SYSTEM_PROMPT },
      ...sanitizedMessages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    // Call Groq with AbortController timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error("Groq API error:", response.status, errText);
        return res.status(500).json({
          text: "The AI service encountered an error. Please try again in a moment.",
        });
      }

      const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      const botText =
        data.choices?.[0]?.message?.content ||
        "I couldn't process that request. Could you rephrase?";

      return res.json({ text: botText });
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return res.status(408).json({
          text: "The AI is taking too long to respond. Please try again.",
        });
      }
      throw fetchError;
    }
  } catch (error: unknown) {
    console.error("Worker error:", error);
    return res.status(500).json({
      text: "A network error occurred. Please check your connection and try again.",
    });
  }
});

// ── Start ──
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n  ⛦ Zenith AI Worker running on port ${PORT}`);
  console.log(`  Groq API Key: ${GROQ_API_KEY ? "✓ configured" : "✗ not set"}`);
  console.log(`  Allowed Origins: ${ALLOWED_ORIGINS.join(", ")}\n`);
});
