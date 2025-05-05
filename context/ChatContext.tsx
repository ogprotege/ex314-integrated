'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChatService } from '@/lib/services/chatService';

const isBrowser = typeof window !== 'undefined';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number; // Fixed: was Date
};

export type Chat = {
  id: string;
  title: string;
  status: 'active' | 'starred' | 'archived' | 'deleted';
  preview?: string;
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
  filterChats: (status: 'all' | 'starred' | 'archived' | 'deleted') => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [visibleChats, setVisibleChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const chatService = new ChatService();
  const userId = getUserId();

  function getUserId(): string {
    if (!isBrowser) return '';
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
    if (!isBrowser) return;
    const stored = localStorage.getItem('chat_threads');
    if (stored) {
      const parsedChats = JSON.parse(stored);
      setChats(parsedChats);
      setVisibleChats(parsedChats);
    }
  }, []);

  useEffect(() => {
    if (activeChatId && isBrowser) {
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
    if (isBrowser) {
      localStorage.setItem('chat_threads', JSON.stringify(updated));
    }
  };

  const updateChat = (id: string, update: Partial<Chat>) => {
    const updated = chats.map((c) => (c.id === id ? { ...c, ...update } : c));
    persistChats(updated);
  };

  const deleteChat = (id: string) => {
    const updated = chats.map((chat) =>
      chat.id === id ? { ...chat, status: 'deleted' as const } : chat
    );
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
      status: 'active',
      preview: ''
    };
    const updated = [chat, ...chats];
    persistChats(updated);
    setActiveChatId(id);
    setMessages([]);
  };

  const selectChat = (id: string) => {
    setActiveChatId(id);
  };

  const filterChats = (status: 'all' | 'starred' | 'archived' | 'deleted') => {
    setVisibleChats(
      status === 'all' ? chats : chats.filter((chat) => chat.status === status)
    );
  };

  const searchMessages = (query: string) => {
    if (!isBrowser) return;
    if (!query.trim()) {
      setVisibleChats(chats);
      return;
    }
    const q = query.toLowerCase();
    const filtered = chats.filter((chat) => {
      if (chat.title.toLowerCase().includes(q)) return true;
      if (chat.preview?.toLowerCase().includes(q)) return true;
      const chatMessages = JSON.parse(localStorage.getItem(getStorageKey(chat.id)) || '[]');
      return chatMessages.some((msg: Message) =>
        msg.content.toLowerCase().includes(q) || msg.role.toLowerCase().includes(q)
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
      timestamp: Date.now() // Fixed
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (isBrowser) {
      localStorage.setItem(getStorageKey(activeChatId), JSON.stringify(updatedMessages));
    }

    setIsLoading(true);

    try {
      const assistantReply = await chatService.sendMessage(
        content,
        updatedMessages,
        userId,
        activeChatId
      );

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: assistantReply,
        role: 'assistant',
        timestamp: Date.now() // Fixed
      };

      const allMessages = [...updatedMessages, assistantMessage];
      setMessages(allMessages);

      if (isBrowser) {
        localStorage.setItem(getStorageKey(activeChatId), JSON.stringify(allMessages));
      }

      const preview = content.length > 64 ? content.slice(0, 64) + '...' : content;
      const updatedChat = chats.map((chat) =>
        chat.id === activeChatId ? { ...chat, preview } : chat
      );
      persistChats(updatedChat);
    } catch (err) {
      console.error('AI ERROR:', err);
      setMessages((current) => {
        const last = current.at(-1);
        if (last?.role === 'assistant' && last.content === '') {
          return [...current.slice(0, -1), { ...last, content: '⚠️ AI error occurred.' }];
        }
        return current;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportChats = () => {
    if (!isBrowser || userId !== 'admin') return;
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
