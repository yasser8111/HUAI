// Select DOM elements
const chatContainer = document.querySelector("#chat-container .container");
const inputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const themeBtn = document.getElementById("theme-btn");

// Textarea base height
const baseHeight = inputField ? inputField.offsetHeight : 0;

// Automatically adjust textarea height
if (inputField) {
  inputField.addEventListener("input", () => {
    inputField.style.height = baseHeight + "px";
    if (inputField.scrollHeight > baseHeight) {
      inputField.style.height = inputField.scrollHeight + "px";
    }
  });
}

// Reset textarea after sending a message
function resetTextarea() {
  inputField.value = "";
  inputField.style.height = baseHeight + "px";
}

// Function to remove basic Markdown formatting (**bold**, *italic*, `code`)
function cleanMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove **bold**
    .replace(/__(.*?)__/g, "$1") // Remove __bold__
    .replace(/\*(.*?)\*/g, "$1") // Remove *italic*
    .replace(/_(.*?)_/g, "$1") // Remove _italic_
    .replace(/`(.*?)`/g, "$1"); // Remove `code`
}

// Restore saved theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (themeBtn) {
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
  } else {
    // If no theme saved, use system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.body.classList.add("dark-mode");
      themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }

  // Toggle theme when button is clicked
  function themeToggle() {
    if (!themeBtn) return;
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeBtn.innerHTML = `<i class="fa-solid ${
      isDark ? "fa-sun" : "fa-moon"
    }"></i>`;
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  themeBtn.onclick = themeToggle; // Attach toggle function

  // Function to add a message to chat
  function addMessage(text, sender) {
    if (sender === "ai") {
      text = cleanMarkdown(text);
    }
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.innerText = text;
    chatContainer.appendChild(div);
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }

  // Function to send a message
  async function sendMessage() {
    const inputText = inputField.value.trim(); // ✅ Use a different variable name
    if (!inputText) return;

    addMessage(inputText, "user"); // Show user message
    resetTextarea();

    const loadingMessage = document.createElement("div");
    loadingMessage.className = "message ai loading";
    loadingMessage.innerText = "جارٍ الرد...";
    chatContainer.appendChild(loadingMessage);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      });

      const serverText = await res.text(); // ✅ renamed to avoid conflict

      if (!res.ok) {
        throw new Error(serverText); // Throw server error as exception
      }

      const data = JSON.parse(serverText); // Convert text to JSON
      loadingMessage.remove();
      addMessage(data.response, "ai"); // Show AI response
    } catch (err) {
      loadingMessage.remove();
      addMessage("حدث خطأ: " + err.message, "ai"); // Show error in chat
    }
  }

  // Event listeners for sending messages
  if (sendBtn && inputField) {
    sendBtn.addEventListener("click", sendMessage);
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}
