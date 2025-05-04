'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  visibleChats: Chat[];
  messages: Message[];
  activeChatId: string | null;
  isLoading: boolean;
  sendMessage: (msg: string) => void;
  newChat: () => void;
  selectChat: (id: string) => void;
  updateChat: (id: string, update: Partial<Chat>) => void;
  deleteChat: (id: string) => void;
  exportChats: () => void;
  searchMessages: (query: string) => void;
  filterChats: (status: 'all' | 'starred' | 'archived') => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [visibleChats, setVisibleChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userId = getUserId();

  function getUserId() {
    let id = localStorage.getItem('user_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('user_id', id);
    }
    return id;
  }

  function getStorageKey(chatId: string) {
    return `chat_history_${chatId}_${userId}`;
  }

  useEffect(() => {
    const stored = localStorage.getItem('chat_threads');
    if (stored) {
      const parsedChats = JSON.parse(stored);
      setChats(parsedChats);
      setVisibleChats(parsedChats);
    }
  }, []);

  useEffect(() => {
    if (activeChatId) {
      const local = localStorage.getItem(getStorageKey(activeChatId));
      if (local) {
        setMessages(JSON.parse(local));
      } else {
        supabase
          .from('messages')
          .select('*')
          .eq('chat_id', activeChatId)
          .order('timestamp')
          .then(({ data }) => {
            if (data) setMessages(data);
          });
      }
    }
  }, [activeChatId]);

  const persistChats = (updated: Chat[]) => {
    setChats(updated);
    setVisibleChats(updated);
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
    localStorage.removeItem(getStorageKey(id));
    supabase.from('messages').delete().eq('chat_id', id);
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
  };

  const filterChats = (filter: 'all' | 'starred' | 'archived') => {
    if (filter === 'all') {
      setVisibleChats(chats);
    } else {
      setVisibleChats(chats.filter(chat => chat.status === filter));
    }
  };

  const searchMessages = (query: string) => {
    if (!query.trim()) {
      setVisibleChats(chats);
      return;
    }
    
    const q = query.toLowerCase();
    const filtered = chats.filter(chat => {
      // Search in title
      if (chat.title.toLowerCase().includes(q)) return true;
      
      // Search in messages
      const chatMessages = JSON.parse(localStorage.getItem(getStorageKey(chat.id)) || '[]');
      return chatMessages.some((msg: Message) => 
        msg.content.toLowerCase().includes(q) || 
        msg.role.toLowerCase().includes(q)
      );
    });
    
    setVisibleChats(filtered);
  };

  const sendMessage = async (content: string) => {
    if (!activeChatId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem(getStorageKey(activeChatId), JSON.stringify(updatedMessages));
    setIsLoading(true);

    await supabase.from('messages').insert({
      chat_id: activeChatId,
      user_id: userId,
      content: userMessage.content,
      role: userMessage.role,
      timestamp: userMessage.timestamp.toISOString()
    });

    try {
      const context = updatedMessages; // 🧠 Full message context
      const res = await fetch('/api/langchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, context })
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      const allMessages = [...updatedMessages, aiMessage];
      setMessages(allMessages);
      localStorage.setItem(getStorageKey(activeChatId), JSON.stringify(allMessages));

      await supabase.from('messages').insert({
        chat_id: activeChatId,
        user_id: userId,
        content: aiMessage.content,
        role: aiMessage.role,
        timestamp: aiMessage.timestamp.toISOString()
      });
    } catch (err) {
      console.error('AI ERROR:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportChats = () => {
    if (userId !== 'admin') return alert('Only admin can export');

    const exportData: Record<string, Message[]> = {};
    chats.forEach((chat) => {
      const data = localStorage.getItem(getStorageKey(chat.id));
      if (data) exportData[chat.title] = JSON.parse(data);
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ex314_export.json`;
    link.click();
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        visibleChats,
        messages,
        activeChatId,
        isLoading,
        sendMessage,
        newChat,
        selectChat,
        updateChat,
        deleteChat,
        exportChats,
        searchMessages,
        filterChats
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
