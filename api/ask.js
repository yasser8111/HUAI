import { askAI } from "../public/ai.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: "prompt required" });
  }

  try {
    const response = await askAI(prompt);
    res.status(200).json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
}
