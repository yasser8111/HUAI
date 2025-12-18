// server.js
import express from "express";
import { askAI } from "./ai.mjs";

const app = express();
app.use(express.json());

app.post("/api/ask", async (req, res) => {
  const { prompt } = req.body;
  const response = await askAI(prompt);
  res.json({ response });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
