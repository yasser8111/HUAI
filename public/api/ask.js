import { askAI } from "../ai.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "prompt required" });
    }

    const response = await askAI(prompt);
    return res.status(200).json({ response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ response: "Server error" });
  }
}
