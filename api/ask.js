// api/ask.js
import { askAI } from "./ai.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    console.log("Received prompt:", prompt); // logging for debugging
    const response = await askAI(prompt);
    console.log("AI response:", response);

    res.status(200).json({ response });
  } catch (err) {
    console.error("API/ask error:", err); // full error in logs
    res.status(500).json({ error: "A server error has occurred" });
  }
}
