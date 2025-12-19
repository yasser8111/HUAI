// api/ai.js
import { config } from "dotenv";
config(); // load .env

export async function askAI(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

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
  if (!res.ok) throw new Error(data.error?.message || "API Error");
  return data.choices?.[0]?.message?.content || "No response";
}
