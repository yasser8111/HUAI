import express from "express";
import { askAI } from "./ai.mjs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Valid prompt is required" });
    }
    const response = await askAI(prompt);
    res.json({ response });
  } catch (err) {
    console.error("AI request failed:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.listen(3000, () => console.log("http://localhost:3000"));
