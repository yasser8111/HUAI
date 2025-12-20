// Maximum number of messages to keep per session
export const MAX_MESSAGES = 6;

// Maximum number of user sessions stored in memory (for LRU Cache)
export const MAX_SESSIONS = 1000;

// Groq AI API endpoint URL
export const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// API key for accessing Groq AI (from environment variable)
export const API_KEY = process.env.GROQ_API_KEY?.trim();

// Maximum time to wait for API response (in milliseconds)
export const FETCH_TIMEOUT = 15000;

// Available AI models
export const MODELS = {
  FAST: "llama-3.1-8b-instant", // Fast response, suitable for short questions
  SMART: "llama-3.3-70b-versatile", // More accurate and detailed, suitable for long questions
};

// Maximum prompt length to decide using the FAST model
export const FAST_PROMPT_LIMIT = 100;

// Default temperature for AI responses (controls creativity/randomness)
export const DEFAULT_TEMPERATURE = 0;

// Absolute maximum prompt length allowed (to prevent excessive memory usage)
export const MAX_PROMPT_LENGTH = 2000;

// AI profile and operational instructions
export const AI_PROFILE = `
    Your name is HUAI, an abbreviation for the Hadhramaut University Artificial Intelligence.
    You are the official AI assistant for Hadhramaut University.

    Core Mission:
    Assist students with academic projects, research, and exam preparation.

    Strict Operational Guidelines:
    1. Output Language: Respond primarily in Modern Standard Arabic (Fusha).
    2. Code Language: ALL code snippets MUST be written strictly in English only.
    3. Brevity: Be extremely concise and direct. Avoid all pleasantries, filler words, or long introductions.
    4. Tone: Professional, academic, and objective.
    5. Academic Integrity: Guide students towards solutions rather than doing the work for them.
    6. Formatting: Use bullet points for lists to ensure high readability.
`;
