// components/ChatMessage.tsx
'use client';

import React from 'react';
import type { Message } from '@/lib/types';
import { UserIcon, BrainCircuitIcon } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  // Check if this is an empty assistant message (waiting for response)
  const isTyping = message.role === 'assistant' && message.content === '';

  return (
    <div className={`flex gap-6 mb-8 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-accent-purple text-white shadow-sm'
            : 'bg-card-bg text-white border border-border-color-light'
        }`}
      >
        {isUser ? <UserIcon size={18} /> : <BrainCircuitIcon size={18} />}
      </div>
      <div
        className={`flex flex-col ${
          isUser ? 'items-end' : 'items-start'
        } max-w-[85%] md:max-w-[75%]`}
      >
        <div
          className={`px-5 py-3 rounded-xl shadow-sm ${
            isUser
              ? 'bg-dark-bg text-white border border-border-color'
              : 'bg-card-bg border border-border-color'
          }`}
        >
          {isTyping ? (
            // Typing indicator with the same styles as your existing loading dots
            <div className="flex space-x-3">
              <div
                className="w-2 h-2 bg-loading-dot rounded-full animate-bounce shadow-sm opacity-90"
                style={{ animationDelay: '0ms', animationDuration: '600ms' }}
              />
              <div
                className="w-2 h-2 bg-loading-dot rounded-full animate-bounce shadow-sm opacity-80"
                style={{ animationDelay: '200ms', animationDuration: '600ms' }}
              />
              <div
                className="w-2 h-2 bg-loading-dot rounded-full animate-bounce shadow-sm opacity-70"
                style={{ animationDelay: '400ms', animationDuration: '600ms' }}
              />
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed text-[15px] text-white/90">
              {message.content}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-custom mt-2 px-2 opacity-75">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};
