import "dotenv/config";
import { LRUCache } from "lru-cache";
import fetch from "node-fetch";
import {
  MAX_MESSAGES,
  MAX_SESSIONS,
  MAX_TOKENS,
  API_KEY,
  FETCH_TIMEOUT,
  MODELS,
  MODEL_THRESHOLDS,
  DEFAULT_TEMPERATURE,
  AI_PROFILE,
} from "../config.js";

// ==========================================
// 1. Session Cache Management
// ==========================================

/**
 * In-memory cache using LRU (Least Recently Used) policy
 * to store chat histories for a set number of sessions (MAX_SESSIONS).
 * Each session is kept for 24 hours (ttl: 1 day).
 */
const memoryCache = new LRUCache({
  max: MAX_SESSIONS,
  ttl: 1000 * 60 * 60, // 1 hours
});

/**
 * Retrieves the chat history (memory) for a specific session ID.
 * Initializes a new memory with the system profile if the session is new.
 * @param {string} sessionId - The unique identifier for the user's session.
 * @returns {Array<Object>} The chat history array, including the system message.
 */
function getMemory(sessionId) {
  if (!memoryCache.has(sessionId)) {
    // Initialize memory with the AI system prompt/profile
    memoryCache.set(sessionId, [{ role: "system", content: AI_PROFILE }]);
  }
  return memoryCache.get(sessionId);
}

/**
 * Adds a new message (user or assistant) to the session memory.
 * Implements a rotating buffer (FIFO) to keep memory size within MAX_MESSAGES.
 * The system message (index 0) is always preserved.
 * @param {Array<Object>} memory - The current chat history array.
 * @param {string} role - The sender's role ('user' or 'assistant').
 * @param {string} content - The text content of the message.
 */
function addMessage(memory, role, content) {
  memory.push({ role, content });
  if (memory.length > MAX_MESSAGES + 1) {
    memory.splice(1, 1);
  }
}

/**
 * Dynamically selects the appropriate AI model based on the prompt length.
 * This strategy aims to optimize cost/speed by using smaller models for short inputs.
 * @param {string} prompt - The user's input string.
 * @returns {string} The name of the selected model.
 */
function selectSmartModel(prompt) {
  const length = prompt.length;
  if (length < MODEL_THRESHOLDS.FAST_LIMIT) {
    return MODELS.FAST;
  } else if (length < MODEL_THRESHOLDS.MEDIUM_LIMIT) {
    return MODELS.MEDIUM;
  } else {
    return MODELS.SMART;
  }
}

// ==========================================
// 2. Main AI Interaction Function
// ==========================================

/**
 * Main function to communicate with the AI model.
 * Handles memory retrieval, message logging, model selection, and API calling.
 * @param {string} sessionId - The unique identifier for the chat session.
 * @param {string} prompt - The user's message/query.
 * @param {Object} [options={}] - Optional parameters (e.g., custom model or temperature).
 * @param {string} [options.model] - Overrides the dynamic model selection.
 * @param {number} [options.temperature] - Overrides the default temperature.
 * @returns {Promise<string>} The AI's response text.
 * @throws {Error} If API key is missing or prompt is invalid.
 */
export async function askAI(sessionId, prompt, options = {}) {
  if (!API_KEY) throw new Error("HF_API_KEY is missing");

  const trimmedPrompt = prompt?.trim();
  if (!trimmedPrompt) throw new Error("Invalid prompt");

  const memory = getMemory(sessionId);
  addMessage(memory, "user", trimmedPrompt);

  const model = options.model || selectSmartModel(trimmedPrompt);
  const temperature = options.temperature ?? DEFAULT_TEMPERATURE;

  try {
    const response = await requestHFRouter(memory, model, temperature);
    addMessage(memory, "assistant", response);
    return response;
  } catch (error) {
    throw error;
  }
}

// ==========================================
// 3. API Request Handler
// ==========================================

/**
 * Handles the actual API call to the Hugging Face Inference API Router.
 * Includes timeout logic using AbortController.
 * @param {Array<Object>} memory - The full chat history to send.
 * @param {string} model - The model name to use for the request.
 * @param {number} temperature - The generation temperature/creativity setting.
 * @returns {Promise<string>} The AI's response text.
 * @throws {Error} If the request fails, times out, or returns a non-200 status.
 */
async function requestHFRouter(memory, model, temperature) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: memory,
          max_tokens: MAX_TOKENS,
          temperature: temperature,
        }),
        signal: controller.signal,
      }
    );

    const data = await res.json();
    clearTimeout(timer);

    if (!res.ok) {
      console.error("API error:", data);
      throw new Error(
        data.error?.message || data.error || `Error: ${res.status}`
      );
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    clearTimeout(timer);
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}
