// ==========================================
// 1. Select DOM Elements
// ==========================================
const elements = {
  chatContainer: document.querySelector("#chat-container .container"),
  inputField: document.getElementById("user-input"),
  sendBtn: document.getElementById("send-btn"),
  themeBtn: document.getElementById("theme-btn"),
};

// ==========================================
// 2. State & Initialization
// ==========================================

// Store the base height of the input field
const baseHeight = elements.inputField ? elements.inputField.offsetHeight : 0;

/**
 * Initialize Theme (Dark/Light Mode) on startup
 */
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add("dark-mode");
    updateThemeIcon(true);
  } else {
    document.body.classList.remove("dark-mode");
    updateThemeIcon(false);
  }
}

function updateThemeIcon(isDark) {
  if (elements.themeBtn) {
    elements.themeBtn.innerHTML = `<i class="fa-solid ${
      isDark ? "fa-sun" : "fa-moon"
    }"></i>`;
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

// ==========================================
// 3. Helper Functions
// ==========================================

/**
 * Automatically adjust input field height
 */
function autoResizeInput() {
  if (!elements.inputField) return;
  elements.inputField.style.height = baseHeight + "px";
  if (elements.inputField.scrollHeight > baseHeight) {
    elements.inputField.style.height = elements.inputField.scrollHeight + "px";
  }
}

/**
 * Reset input field after sending
 */
function resetInput() {
  if (!elements.inputField) return;
  elements.inputField.value = "";
  elements.inputField.style.height = baseHeight + "px";
}

/**
 * Highlight code blocks within a specific element using Highlight.js
 */
export function highlightCode(container) {
  if (window.hljs) {
    container.querySelectorAll("pre code").forEach((block) => {
      window.hljs.highlightElement(block);
    });
  }
}

/**
 * Add a wrapper to tables to ensure horizontal scrolling on mobile
 */
function wrapTables(container) {
  container.querySelectorAll("table").forEach((table) => {
    if (table.closest(".table-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);

    // Center small tables
    if (table.offsetWidth < wrapper.clientWidth) {
      wrapper.classList.add("center");
    }
  });
}

/**
 * Scroll to the bottom of the chat
 */
function scrollToBottom() {
  if (elements.chatContainer) {
    elements.chatContainer.scrollTo({
      top: elements.chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }
}

// ==========================================
// 4. Chat Logic
// ==========================================

/**
 * Add a message to the chat interface
 * @param {string} text - The message text
 * @param {string} sender - 'user' or 'ai'
 */
function addMessage(text, sender) {
  if (!elements.chatContainer) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;

  if (sender === "ai") {
    // Convert Markdown to HTML
    // Note: Ensure the 'marked' library is loaded in the HTML file
    msgDiv.innerHTML = window.marked ? window.marked.parse(text) : text;

    // Highlight code and format tables
    highlightCode(msgDiv);
    addCopyButtons(msgDiv);
    wrapTables(msgDiv);
  } else {
    // For plain text (User) to prevent XSS vulnerabilities
    msgDiv.innerText = text;
  }

  elements.chatContainer.appendChild(msgDiv);
  scrollToBottom();
}

/**
 * Send the message to the server
 */
async function sendMessage() {
  if (!elements.inputField) return;

  const text = elements.inputField.value.trim();
  if (!text) return;

  // 1. Display user message
  addMessage(text, "user");
  resetInput();

  // 2. Display loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai loading";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    loadingDiv.appendChild(dot);
  }
  elements.chatContainer.appendChild(loadingDiv);
  scrollToBottom();

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });

    const serverResponse = await res.text();

    if (!res.ok) {
      throw new Error(serverResponse || "خطأ في الاتصال بالسيرفر");
    }

    const data = JSON.parse(serverResponse);
    
    if (!data.response) {
      throw new Error("Invalid server response format");
    }

    // Remove loading indicator and add the actual response
    loadingDiv.remove();
    addMessage(data.response, "ai");  } catch (err) {
    loadingDiv.remove();
    addMessage(`حدث خطأ: ${err.message}`, "ai");
    console.error(err);
  }
}

/**
 * Add copy buttons to code blocks inside a container
 */
function addCopyButtons(container) {
  container.querySelectorAll("pre").forEach((pre) => {
    if (pre.parentElement.classList.contains("code-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper";

    const button = document.createElement("button");
    button.className = "copy-btn";
    button.innerHTML = '<i class="fa-regular fa-copy"></i>';

    button.addEventListener("click", async () => {
      const code = pre.querySelector("code")?.innerText || "";
      try {
        await navigator.clipboard.writeText(code);
        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          button.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 1500);
      } catch (err) {
      }
    });

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(button);
    wrapper.appendChild(pre);
  });
}

// ==========================================
// 5. Event Listeners
// ==========================================

// Initialize theme on load
initTheme();

// Theme toggle button
if (elements.themeBtn) {
  elements.themeBtn.addEventListener("click", toggleTheme);
}

// Input field and send button interactions
if (elements.inputField && elements.sendBtn) {
  elements.inputField.addEventListener("input", autoResizeInput);

  elements.sendBtn.addEventListener("click", sendMessage);

  elements.inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}
