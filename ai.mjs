import { config } from "dotenv";
import { aiProfile } from "./aiProfile.js";
config();

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = process.env.GROQ_API_KEY;

export async function askAI(prompt, options = {}) {
  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: aiProfile },
      { role: "user", content: prompt },
    ],
    ...options,
  };

  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "لا يوجد رد";
}
