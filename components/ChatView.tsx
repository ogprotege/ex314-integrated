import React, { useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import type { Message } from '../lib/types';
interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}
export const ChatView = ({
  messages,
  isLoading,
  onSendMessage
}: ChatViewProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return <div className="flex flex-col h-full bg-dark-bg">
      <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar" style={{
      backgroundImage: 'radial-gradient(circle at center, #252525 0%, #1E1E1E 100%)'
    }}>
        <div className="max-w-[800px] mx-auto">
          {messages.map(message => <ChatMessage key={message.id} message={message} />)}
          {isLoading && <div className="flex items-center gap-2 p-4 ml-16">
              <div className="flex space-x-3">
                <div className="w-2 h-2 bg-loading-dot rounded-full animate-bounce shadow-sm opacity-90" style={{
              animationDelay: '0ms',
              animationDuration: '600ms'
            }} />
                <div className="w-2 h-2 bg-loading-dot rounded-full animate-bounce shadow-sm opacity-80" style={{
              animationDelay: '200ms',
              animationDuration: '600ms'
            }} />
                <div className="w-2 h-2 bg-loading-dot rounded-full animate-bounce shadow-sm opacity-70" style={{
              animationDelay: '400ms',
              animationDuration: '600ms'
            }} />
              </div>
            </div>}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 md:p-6 bg-dark-bg border-t border-border-color-light">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>;
};
