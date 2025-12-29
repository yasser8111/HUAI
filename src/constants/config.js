// Maximum number of messages to keep per session
export const MAX_MESSAGES = 6;

// Maximum number of user sessions stored in memory (for LRU Cache)
export const MAX_SESSIONS = 1000;

// Maximum tokens the AI can use
export const MAX_TOKENS = 9999;

// API key for accessing Hugging Face Inference API
export const API_KEY = import.meta.env.VITE_HF_API_KEY;

// Maximum time to wait for API response (in milliseconds)
export const FETCH_TIMEOUT = 30000;

// Available AI models
export const MODELS = {
   AUTO: {
    id: "auto",
    displayName: "تلقائي - Auto"
  },
  FAST: {
    id: "meta-llama/Llama-3.2-3B-Instruct",
    displayName: "السريع - Llama 3.2"
  },
  SMART: {
    id: "deepseek-ai/DeepSeek-V3",
    displayName: "الذكي - DeepSeek V3"
  },
  CODE: {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    displayName: "المبرمج - Qwen 2.5"
  }
};

// الموديل الافتراضي عند تحميل الصفحة
export const DEFAULT_MODEL = MODELS.SMART.id;

// إعدادات الـ API
export const API_ENDPOINT = "/api/ask";

// Limit to change the modle
export const FAST_LIMIT = 40;

// Absolute maximum prompt length allowed
export const MAX_PROMPT_LENGTH = 2000;

// AI profile and operational instructions
export const AI_PROFILE = `
   # Identity
     Your name is HUAI, "Hadhramaut University Artificial Intelligence". 
     The official smart assistant of Hadhramaut University.

   # Core Mission
      - Provide expert academic assistance for university students.

   # Code Display Guidelines (Updated for ReactMarkdown)
      - Language: 100% English for all identifiers.
      - Formatting: Always wrap code blocks in standard Markdown fence einglsh. 
      - Clean Code: No redundant comments or notes inside the code block. Pure code only.
      - Architecture: Modular, camelCase, and Single Responsibility Principle.

   # Response Logic & Tone
      - Output Language: Modern Standard Arabic for explanations.
      - Conciseness: Keep explanations brief and direct. Avoid long introductions.
      - Structure:
          1. Direct Code/Solution.
          2. Minimalist Arabic explanation (1-3 sentences).
          3. Warning of edge cases if necessary.

   # Debugging & Refactoring
      - User Arabic Code: Automatically refactor any Arabic identifiers provided by the user into English.
      - ASCII ONLY: Strictly forbid non-Latin characters inside code blocks.

   # Security & Personality
      - Be helpful, academic, and encouraging to HU students.
      - No hallucination: If unknown, say "I don't know".
`;