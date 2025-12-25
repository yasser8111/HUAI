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
    addCopyBtn(msgDiv);
    wrapTables(msgDiv);
  } else {
    // For plain text (User) to prevent XSS vulnerabilities
    msgDiv.innerText = text;
  }

  elements.chatContainer.appendChild(msgDiv);
  scrollToBottom();
}

/**
 * Create and add a loading indicator(Loading Indicator)
 * @returns {HTMLElement} The downloaded item was later deleted.
 */
function showLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai loading";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    loadingDiv.appendChild(dot);
  }
  elements.chatContainer.appendChild(loadingDiv);
  scrollToBottom();
  return loadingDiv;
}

/**
 * Hide the loading indicator
 * @param {HTMLElement} loadingDiv - The item to be deleted
 */
function hideLoading(loadingDiv) {
  if (loadingDiv) loadingDiv.remove();
}

/**
 * Update the status of the send button and field
 * @param {boolean} isLoading - Loading status
 */
function setChatState(isLoading) {
  const originalIcon = '<i class="fa-solid fa-paper-plane"></i>';
  const loadingIcon = '<i class="fa-solid fa-square"></i>';

  elements.sendBtn.disabled = isLoading;
  elements.inputField.disabled = isLoading;
  elements.sendBtn.innerHTML = isLoading ? loadingIcon : originalIcon;

  if (!isLoading) {
    elements.inputField.focus();
  }
}

/**
 * Send the message to the server
 */
async function sendMessage() {
  if (!elements.inputField || elements.sendBtn.disabled) return;

  const text = elements.inputField.value.trim();
  if (!text) return;

  setChatState(true);
  addMessage(text, "user");
  resetInput();
  const loadingIndicator = showLoading();

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });

    const serverResponse = await res.text();
    if (!res.ok) throw new Error(serverResponse || "خطأ في الاتصال");

    const data = JSON.parse(serverResponse);
    hideLoading(loadingIndicator);
    addMessage(data.response, "ai");
  } catch (err) {
    hideLoading(loadingIndicator);
    addMessage(`حدث خطأ: ${err.message}`, "ai");
  } finally {
    setChatState(false);
  }
}

/**
 * Add copy buttons and langguge name to code blocks inside a container
 */
function addCopyBtn(container) {
  container.querySelectorAll("pre:not(.code-wrapper pre)").forEach((pre) => {
    const code = pre.querySelector("code");
    const lang = code?.className.match(/language-(\S+)/)?.[1] || "code";

    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper";

    wrapper.innerHTML = `
      <div class="code-header">
        <button class="copy-btn"><i class="fa-regular fa-copy"></i></button>
        <span class="lang-name">${lang}</span>
      </div>
    `;

    pre.replaceWith(wrapper);
    wrapper.append(pre);

    wrapper.querySelector(".copy-btn").onclick = async ({
      currentTarget: btn,
    }) => {
      try {
        await navigator.clipboard.writeText(code?.innerText || pre.innerText);
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(
          () => (btn.innerHTML = '<i class="fa-regular fa-copy"></i>'),
          1500
        );
      } catch (err) {
        console.error("Copy failed", err);
      }
    };
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
