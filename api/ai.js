// api/ai.js
import { config } from "dotenv";
config();

export async function askAI(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: "You are HUAI, a helpful AI assistant for students." },
          { role: "user", content: prompt },
        ],
        temperature: 0,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Groq API Error:", data);
      throw new Error(data.error?.message || "Groq API returned an error");
    }

    return data.choices?.[0]?.message?.content || "No response from AI";
  } catch (err) {
    console.error("askAI fetch error:", err);
    throw err; // rethrow to be caught in ask.js
  }
}
