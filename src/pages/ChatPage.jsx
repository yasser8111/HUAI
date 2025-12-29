import { useState } from "react";
import InputArea from "../components/InputArea";
import ChatContainer from "../components/ChatContainer";
import { askAI } from "../api/ai";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { role: "ai", content: "مرحباً! أنا HUAI، كيف يمكنني مساعدتك اليوم؟" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text, selectedModel) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await askAI("session-1", text, { model: selectedModel });
      setMessages(prev => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "عذراً، حدث خطأ أثناء الاتصال بالخادم." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pb-32">
      <ChatContainer messages={messages} isLoading={isLoading} />
      <InputArea onSend={handleSendMessage} disabled={isLoading} />
    </main>
  );
};

export default ChatPage;