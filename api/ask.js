import { askAI } from "../../ai.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { prompt } = req.body;
  const response = await askAI(prompt);
  res.status(200).json({ response });
}