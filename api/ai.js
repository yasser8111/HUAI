import { config } from "dotenv";
config();

const memory = [];

export async function askAI(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  memory.push({ role: "user", content: prompt });

  if (memory.length > 10) memory.shift();

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are HUAI, a helpful AI assistant for students." },
          ...memory,
        ],
        temperature: 0,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Groq API Error:", data);
      throw new Error(data.error?.message || "Groq API returned an error");
    }

    const aiResponse = data.choices?.[0]?.message?.content || "No response from AI";
    
    memory.push({ role: "assistant", content: aiResponse });

    return aiResponse;
  } catch (err) {
    console.error("askAI fetch error:", err);
    throw err;
  }
}