import Groq from "groq";
import { aiProfile } from "./aiProfile.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askAI(prompt) {
  const chat = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      { role: "system", content: aiProfile },
      { role: "user", content: prompt },
    ],
    temperature: 0,
  });

  return chat.choices[0].message.content;
}
