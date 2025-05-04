'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export type Chat = {
  id: string;
  title: string;
  status: 'active' | 'starred' | 'archived';
};

type ChatContextType = {
  chats: Chat[];
  messages: Message[];
  activeChatId: string | null;
  isLoading: boolean;
  sendMessage: (msg: string) => void;
  newChat: () => void;
  selectChat: (id: string) => void;
  updateChat: (id: string, update: Partial<Chat>) => void;
  deleteChat: (id: string) => void;
  exportChats: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 ID helpers
  const getUserId = () => {
    let id = localStorage.getItem('user_id');
    if (!id) {
      id = crypto.randomUUID(); // native UUID fallback
      localStorage.setItem('user_id', id);
    }
    return id;
  };

  const getStorageKey = (chatId: string) => `chat_history_${chatId}_${getUserId()}`;

  // 📥 Load chats
  useEffect(() => {
    const stored = localStorage.getItem('chat_threads');
    if (stored) setChats(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (activeChatId) {
      const history = localStorage.getItem(getStorageKey(activeChatId));
      setMessages(history ? JSON.parse(history) : []);
    }
  }, [activeChatId]);

  const persistChats = (updated: Chat[]) => {
    setChats(updated);
    localStorage.setItem('chat_threads', JSON.stringify(updated));
  };

  const updateChat = (id: string, update: Partial<Chat>) => {
    const updated = chats.map((c) => (c.id === id ? { ...c, ...update } : c));
    persistChats(updated);
  };

  const deleteChat = (id: string) => {
    const updated = chats.filter((c) => c.id !== id);
    persistChats(updated);
    if (id === activeChatId) {
      setActiveChatId(null);
      setMessages([]);
    }
  };

  const newChat = () => {
    const id = Date.now().toString();
    const chat: Chat = {
      id,
      title: 'Untitled Chat',
      status: 'active'
    };
    const updated = [chat, ...chats];
    persistChats(updated);
    setActiveChatId(id);
    setMessages([]);
  };

  const selectChat = (id: string) => {
    setActiveChatId(id);
    const history = localStorage.getItem(getStorageKey(id));
    setMessages(history ? JSON.parse(history) : []);
  };

  const sendMessage = async (content: string) => {
    if (!activeChatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem(getStorageKey(activeChatId), JSON.stringify(updatedMessages));
    setIsLoading(true);

    try {
      const context = updatedMessages; // full context, no slice
      const res = await fetch('/api/langchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, context })
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      const allMessages = [...updatedMessages, aiMessage];
      setMessages(allMessages);
      localStorage.setItem(getStorageKey(activeChatId), JSON.stringify(allMessages));
    } catch (err) {
      console.error('AI ERROR:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🛡 Admin-only export
  const exportChats = () => {
    const userId = getUserId();
    if (userId !== 'admin') {
      alert('Unauthorized export.');
      return;
    }

    const exportData: Record<string, Message[]> = {};
    chats.forEach((chat) => {
      const key = getStorageKey(chat.id);
      const data = localStorage.getItem(key);
      if (data) exportData[chat.title] = JSON.parse(data);
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ex314_user_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        activeChatId,
        isLoading,
        sendMessage,
        newChat,
        selectChat,
        updateChat,
        deleteChat,
        exportChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
