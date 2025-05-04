'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';

export const ChatSearch = () => {
  const { searchChats, selectChat } = useChat();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    { chatId: string; match: { content: string; role: string; timestamp: string } }[]
  >([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length > 1) {
      const found = searchChats(q);
      setResults(found);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="px-3 py-2 border-t border-[#444]">
      <input
        type="text"
        placeholder="Search chats..."
        value={query}
        onChange={handleChange}
        className="w-full p-2 rounded bg-input-bg text-sm text-white border border-[#444] mb-2"
      />
      {results.length > 0 && (
        <div className="max-h-40 overflow-auto custom-scrollbar space-y-1">
          {results.map((r, idx) => (
            <button
              key={idx}
              onClick={() => selectChat(r.chatId)}
              className="block text-left w-full text-sm text-gray-custom hover:text-white hover:bg-[#2c2c2c] p-2 rounded transition-all"
            >
              <span className="block text-xs mb-1 opacity-60">
                {new Date(r.match.timestamp).toLocaleString()}
              </span>
              {r.match.content.length > 120
                ? r.match.content.slice(0, 120) + '...'
                : r.match.content}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
