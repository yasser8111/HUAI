import { askAI } from "../ai.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await askAI(prompt);
    res.status(200).json({ response });
  } catch (err) {
    console.error("API/ask error:", err.message || err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
