'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { InitialView } from '@/components/InitialView';
import { ChatView } from '@/components/ChatView';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';

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

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [chats, setChats] = useState<Chat[]>(() => {
    const stored = localStorage.getItem('chat_threads');
    return stored ? JSON.parse(stored) : [];
  });

  const onUpdateChat = (id: string, update: Partial<Chat>) => {
    setChats((prev) => {
      const updated = prev.map((chat) =>
        chat.id === id ? { ...chat, ...update } : chat
      );
      localStorage.setItem('chat_threads', JSON.stringify(updated));
      return updated;
    });
  };

  const onDeleteChat = (id: string) => {
    const updated = chats.filter((chat) => chat.id !== id);
    setChats(updated);
    localStorage.setItem('chat_threads', JSON.stringify(updated));
    if (activeChatId === id) {
      setActiveChatId(null);
      setMessages([]);
    }
  };

  const onSelectChat = (id: string) => {
    setActiveChatId(id);
    const history = localStorage.getItem(`chat_history_${id}`);
    setMessages(history ? JSON.parse(history) : []);
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat: Chat = {
      id: newId,
      title: 'Untitled Chat',
      status: 'active'
    };
    const updated = [newChat, ...chats];
    setChats(updated);
    localStorage.setItem('chat_threads', JSON.stringify(updated));
    setActiveChatId(newId);
    setMessages([]);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_history_${activeChatId}`, JSON.stringify(updatedMessages));
    setIsLoading(true);

    try {
      const pastContext = updatedMessages.slice(-10); // Memory-aware chunk
      const response = await fetch('/api/langchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          context: pastContext // 👈 included in the API
        })
      });

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      localStorage.setItem(`chat_history_${activeChatId}`, JSON.stringify(newMessages));
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!isLoggedIn) router.push('/login');
    else setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-dark-bg text-white font-segoe">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={() => {
            sessionStorage.removeItem('isAuthenticated');
            router.push('/login');
          }}
          chats={chats}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onDeleteChat={onDeleteChat}
          onSelectChat={onSelectChat}
          onUpdateChat={onUpdateChat}
        />
        <main className="flex-grow flex flex-col h-full overflow-hidden">
          <Header />
          {messages.length === 0 ? (
            <InitialView onSendMessage={handleSendMessage} />
          ) : (
            <ChatView
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
