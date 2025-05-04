'use client';

import React, { useState, useMemo } from 'react';
import { useChat } from '@/context/ChatContext';
import { XIcon } from 'lucide-react';

type Filter = 'all' | 'starred' | 'archived' | 'deleted';

export const ChatHistoryDrawer = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { chats, selectChat } = useChat();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filteredChats = useMemo(() => {
    return chats
      .filter((chat) => {
        if (filter === 'starred') return chat.status === 'starred';
        if (filter === 'archived') return chat.status === 'archived';
        // For 'deleted', we need to check if status is any string that matches 'deleted'
        if (filter === 'deleted') return chat.status && chat.status.toLowerCase() === 'deleted';
        return true; // 'all' filter
      })
      .filter((chat) =>
        chat.title.toLowerCase().includes(search.toLowerCase()) ||
        (chat.preview && chat.preview.toLowerCase().includes(search.toLowerCase()))
      )
      .sort(
        (a, b) => Number(b.id) - Number(a.id) // assuming id is a timestamp string
      );
  }, [chats, search, filter]);

  // Get chat preview text
  const getChatPreview = (chatId: string): string => {
    if (typeof window === 'undefined') return '';
    
    const history = localStorage.getItem(`chat_history_${chatId}`);
    if (!history) return 'No messages yet...';
    
    try {
      const messages = JSON.parse(history);
      if (messages && messages.length > 0) {
        const firstMessage = messages[0];
        const content = firstMessage.content || '';
        return content.length > 64 ? content.slice(0, 64) + '...' : content;
      }
      return 'Empty chat';
    } catch (e) {
      return 'Unable to retrieve messages';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-dark-bg z-50 w-[75%] max-w-3xl border-l border-[#333] shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#444]">
          <h2 className="text-lg font-semibold text-white">Chat History</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-[#444]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your chat history..."
            className="w-full p-2 bg-input-bg border border-[#444] rounded text-sm text-white placeholder:text-gray-custom"
          />
        </div>

        <div className="p-4 border-b border-[#444] flex gap-2">
          {(['all', 'starred', 'archived', 'deleted'] as Filter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === key
                  ? 'bg-accent-purple text-white'
                  : 'bg-card-bg text-gray-custom hover:text-white hover:bg-[#333]'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto h-[calc(100vh-200px)] p-4 custom-scrollbar space-y-3">
          {filteredChats.length === 0 ? (
            <div className="text-gray-custom text-center p-4">
              No chats found.
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  selectChat(chat.id);
                  onClose();
                }}
                className="p-3 rounded bg-card-bg border border-[#444] hover:border-accent-purple transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm text-white">
                    {chat.title || 'Untitled Chat'}
                  </h3>
                  <span className="text-xs text-gray-custom">
                    {new Date(Number(chat.id)).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-custom mt-2 truncate">
                  {chat.preview || getChatPreview(chat.id)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
