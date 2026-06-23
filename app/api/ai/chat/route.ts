import { NextResponse } from "next/server";
import { ZENITH_SYSTEM_PROMPT, OFFLINE_RESPONSES } from "@/lib/ai-prompt";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const key = process.env.GROQ_API_KEY;

    if (!key || key === "gsk_your_groq_api_key_here" || key.trim() === "") {
      return NextResponse.json({
        text: OFFLINE_RESPONSES[Math.floor(Math.random() * OFFLINE_RESPONSES.length)],
      });
    }

    // Build conversation history for Groq (OpenAI-compatible format)
    const chatMessages = [
      { role: "system" as const, content: ZENITH_SYSTEM_PROMPT },
      ...messages.map((m: { sender: string; content: string }) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

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
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return NextResponse.json({
        text: "The AI service encountered an error. Please try again in a moment.",
      });
    }

    const data = await response.json();
    const botText =
      data.choices?.[0]?.message?.content ||
      "I couldn't process that request. Could you rephrase?";
    return NextResponse.json({ text: botText });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json({
      text: "A network error occurred. Please check your connection and try again.",
    });
  }
}
