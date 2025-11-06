
import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { ChatBubbleOvalLeftEllipsisIcon } from './icons/ChatBubbleOvalLeftEllipsisIcon';
import { XMarkIcon } from './icons/XMarkIcon';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-sky-400 transition-transform transform hover:scale-110"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />}
        </button>
      </div>
      {isOpen && <Chatbot closeChat={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatWidget;
