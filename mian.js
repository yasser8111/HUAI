const chatContainer = document.querySelector("#chat-container .container");
const inputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const themeBtn = document.getElementById("theme-btn");

// Textarea height base
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

function resetTextarea() {
  inputField.value = "";
  inputField.style.height = baseHeight + "px";
}

// Restore saved settings from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
} else if (savedTheme === "light") {
  document.body.classList.remove("dark-mode");
  themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
} else {
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

// Change mode when the button is pressed
function themeToggle() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeBtn.innerHTML = `<i class="fa-solid ${
    isDark ? "fa-sun" : "fa-moon"
  }"></i>`;
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

themeBtn.onclick = themeToggle;

// Add a message to the chat
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatContainer.appendChild(div);
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
}

// Send a message
async function sendMessage() {
  const text = inputField.value.trim();
  if (!text) return;

  addMessage(text, "user");
  resetTextarea();

  const loadingMessage = document.createElement("div");
  loadingMessage.className = "message ai loading";
  loadingMessage.innerText = "جارٍ الرد...";
  chatContainer.appendChild(loadingMessage);

  try {
    const res = await fetch("http://localhost:3000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });
    const data = await res.json();
    loadingMessage.remove();
    addMessage(data.response, "ai");
  } catch (err) {
    loadingMessage.remove();
    addMessage("حدث خطأ أثناء التواصل مع الخادم.", "ai");
  }
}

// Message sending events
if (sendBtn && inputField) {
  sendBtn.addEventListener("click", sendMessage);
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}
