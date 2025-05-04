'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { InitialView } from '@/components/InitialView';
import { ChatView } from '@/components/ChatView';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
import { ChatService } from '@/lib/services/chatService';
import type { Message } from '@/lib/types';

const chatService = new ChatService();

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      content: '',
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(true);

    try {
      await chatService.streamMessage(content, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: '⚠️ Error streaming AI response.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          onLogout={handleLogout}
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
