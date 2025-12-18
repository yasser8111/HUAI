import express from "express";
import { askAI } from "./public/ai.mjs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/ask", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt required" });

  try {
    const response = await askAI(prompt);
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: "حدث خطأ أثناء معالجة الطلب" });
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
