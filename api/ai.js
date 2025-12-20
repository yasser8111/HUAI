import "dotenv/config";
import { LRUCache } from "lru-cache";

import {
  MAX_MESSAGES,
  MAX_SESSIONS,
  GROQ_URL,
  API_KEY,
  FETCH_TIMEOUT,
  MODELS,
  FAST_PROMPT_LIMIT,
  DEFAULT_TEMPERATURE,
  AI_PROFILE,
} from "../config.js";

const memoryCache = new LRUCache({
  max: MAX_SESSIONS,
  ttl: 1000 * 60 * 60 * 24,
});

/* =========================
   Memory Management
========================= */
function getMemory(sessionId) {
  if (!memoryCache.has(sessionId)) {
    memoryCache.set(sessionId, []);
  }
  return memoryCache.get(sessionId);
}

function addMessage(memory, role, content) {
  memory.push({ role, content });
  while (memory.length > MAX_MESSAGES) memory.shift();
}

/* =========================
   AI Request
========================= */
export async function askAI(sessionId, prompt, options = {}) {
  validateEnv();

  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Invalid prompt");
  }

  const memory = getMemory(sessionId);
  addMessage(memory, "user", prompt);

  const model = options.model || selectModel(prompt);
  const temperature = options.temperature ?? DEFAULT_TEMPERATURE;

  const response = await requestAI(memory, model, temperature);
  addMessage(memory, "assistant", response);

  return response;
}

/* =========================
   Helpers
========================= */
function validateEnv() {
  if (!API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }
}

function selectModel(prompt) {
  return prompt.length < FAST_PROMPT_LIMIT ? MODELS.FAST : MODELS.SMART;
}

async function fetchWithTimeout(url, options, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function requestAI(memory, model, temperature) {
  try {
    const res = await fetchWithTimeout(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        messages: [{ role: "system", content: AI_PROFILE }, ...memory],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Groq API Error:", data);
      throw new Error(data.error?.message || "Groq API error");
    }

    return data.choices?.[0]?.message?.content || "No response from AI";
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("AI request timed out");
    }
    throw new Error("AI service unavailable");
  }
}
