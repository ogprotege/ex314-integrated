'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Set isClient to true once component is mounted
  useEffect(() => {
    setIsClient(true);
    
    // Now it's safe to access localStorage
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = uuidv4();
      localStorage.setItem('user_id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  // Only load chats after component has mounted
  useEffect(() => {
    if (isClient) {
      const stored = localStorage.getItem('chat_threads');
      if (stored) {
        const parsedChats = JSON.parse(stored);
        setChats(parsedChats);
        setVisibleChats(parsedChats);
      }
    }
  }, [isClient]);

  // Load messages when activeChatId changes
  useEffect(() => {
    if (isClient && activeChatId) {
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
  }, [activeChatId, isClient]);

  function getStorageKey(chatId: string) {
    return `chat_history_${chatId}_${userId}`;
  }

  const persistChats = (updated: Chat[]) => {
    setChats(updated);
    setVisibleChats(updated);
    localStorage.setItem('chat_threads', JSON.stringify(updated));
  };

  const updateChat = (id: string, update: Partial<Chat>) => {
    if (!isClient) return;
    const updated = chats.map((c) => (c.id === id ? { ...c, ...update } : c));
    persistChats(updated);
  };

  const deleteChat = (id: string) => {
    if (!isClient) return;
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
    if (!isClient) return;
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
    if (!isClient) return;
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
    if (!isClient || !activeChatId) return;

    const userMessage: Message = {
      id: uuidv4(),
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
        id: uuidv4(),
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
    if (!isClient) return;
    
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
