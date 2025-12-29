import React from "react";
import Message from "./Message";

const ChatContainer = ({ messages, isLoading }) => {
  return (
    <div id="chat-container" className="flex-1 py-20 px-2 sm:px-4">
      <div className="container mx-auto max-w-[800px] flex flex-col">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}

        {isLoading && <Message role="ai" isLoading={true} />}
      </div>
    </div>
  );
};

export default ChatContainer;
