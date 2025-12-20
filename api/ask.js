// api/ask.js
import { askAI } from "./ai.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Pass a sessionId (e.g., "default-session") as the first argument
    const response = await askAI("default-session", prompt);

    res.status(200).json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}