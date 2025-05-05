'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { ChatService } from '@/lib/services/chatService';

// Browser check for server-side rendering
const isBrowser = typeof window !== 'undefined';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
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

  const userId = getUserId();
  const chatService = new ChatService();

  function getUserId() {
    // Add check before localStorage access
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
    // Add check before localStorage access
    if (!isBrowser) return;
    
    const stored = localStorage.getItem('chat_threads');
    if (stored) {
      const parsedChats = JSON.parse(stored);
      setChats(parsedChats);
      setVisibleChats(parsedChats);
    }
  }, []);

  useEffect(() => {
    if (activeChatId) {
      // Add check before localStorage access
      if (!isBrowser) return;
      
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
    
    // Add check before localStorage access
    if (isBrowser) {
      localStorage.setItem('chat_threads', JSON.stringify(updated));
    }
  };

  const updateChat = (id: string, update: Partial<Chat>) => {
    const updated = chats.map((c) => (c.id === id ? { ...c, ...update } : c));
    persistChats(updated);
  };

  const deleteChat = (id: string) => {
    // Instead of removing the chat, update its status to 'deleted'
    const updated = chats.map((chat) => {
      if (chat.id === id) {
        return {
          ...chat,
          status: 'deleted' as const // Use const assertion to fix TypeScript error
        };
      }
      return chat;
    });
    
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
    if (status === 'all') {
      setVisibleChats(chats);
    } else {
      setVisibleChats(chats.filter(chat => chat.status === status));
    }
  };

  const searchMessages = (query: string) => {
    if (!isBrowser) return;
    
    if (!query.trim()) {
      setVisibleChats(chats);
      return;
    }
    
    const q = query.toLowerCase();
    const filtered = chats.filter(chat => {
      // Search in title
      if (chat.title.toLowerCase().includes(q)) return true;
      
      // Search in preview
      if (chat.preview && chat.preview.toLowerCase().includes(q)) return true;
      
      // Search in messages
      // Add check before localStorage access
      if (!isBrowser) return false;
      
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
    
    // Add check before localStorage access
    if (isBrowser) {
      localStorage.setItem(getStorageKey(activeChatId), JSON.stringify(updatedMessages));
    }
    
    setIsLoading(true);

    // If using Supabase, store the user message
    await supabase.from('messages').insert({
      chat_id: activeChatId,
      user_id: userId,
      content: userMessage.content,
      role: userMessage.role,
      timestamp: userMessage.timestamp.toISOString()
    });

    try {
      // Create an empty assistant message to show typing indicator
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: '', // Start with empty content
        role: 'assistant',
        timestamp: new Date()
      };

      // Add the empty assistant message to show typing indicator
      setMessages([...updatedMessages, assistantMessage]);
      
      let fullResponse = '';
      
      // Stream the response using Together AI
      await chatService.streamMessage(
        content, 
        updatedMessages,
        (chunk, fullContent) => {
          fullResponse = fullContent;
          
          // Update the message content as chunks arrive
          setMessages(current => {
            const lastMessage = current[current.length - 1];
            if (lastMessage.role === 'assistant') {
              return [
                ...current.slice(0, -1),
                { ...lastMessage, content: fullContent }
              ];
            }
            return current;
          });
        }
      );

      // Final response is now complete
      const completedAssistantMessage: Message = {
        ...assistantMessage,
        content: fullResponse,
      };

      const allMessages = [...updatedMessages, completedAssistantMessage];
      
      // Update local storage with the complete conversation
      if (isBrowser) {
        localStorage.setItem(getStorageKey(activeChatId), JSON.stringify(allMessages));
      }

      // Generate a preview from the user's message
      const preview = content.length > 64 ? content.slice(0, 64) + '...' : content;
      
      // Update the chat with the preview
      const updatedChat = chats.map(chat => 
        chat.id === activeChatId ? { ...chat, preview } : chat
      );
      persistChats(updatedChat);

      // Store the assistant message in Supabase
      await supabase.from('messages').insert({
        chat_id: activeChatId,
        user_id: userId,
        content: completedAssistantMessage.content,
        role: completedAssistantMessage.role,
        timestamp: completedAssistantMessage.timestamp.toISOString()
      });
    } catch (err) {
      console.error('AI ERROR:', err);
      
      // Handle error by updating UI
      setMessages(current => {
        const lastMessage = current[current.length - 1];
        if (lastMessage.role === 'assistant' && lastMessage.content === '') {
          return [
            ...current.slice(0, -1),
            { ...lastMessage, content: "I'm sorry, I encountered an error while processing your request." }
          ];
        }
        return current;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportChats = () => {
    // Add check before localStorage access
    if (!isBrowser) ret
