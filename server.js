import express from "express";
import { askAI } from "./ai.mjs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/ask", async (req, res) => {
  try {
    const response = await askAI(req.body.prompt);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ response: err.message });
  }
});

app.listen(3000, () => console.log("http://localhost:3000"));