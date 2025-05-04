'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { InitialView } from '@/components/InitialView';
import { ChatView } from '@/components/ChatView';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
import type { Message } from '@/lib/types';

type ChatThread = {
  id: string;
  title: string;
  messages: Message[];
};

export default function Home() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load user prefs
  const aiTone = localStorage.getItem('ai_tone') || 'formal';
  const markdownEnabled = localStorage.getItem('markdown_enabled') !== 'false';

  // Load saved chats on init
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);

    const savedThreads = JSON.parse(localStorage.getItem('chat_threads') || '[]');
    const lastActive = localStorage.getItem('active_chat_id');
    setChatThreads(savedThreads);
    setActiveChatId(lastActive || (savedThreads[0]?.id ?? null));
  }, [router]);

  const activeThread = chatThreads.find((t) => t.id === activeChatId);
  const messages = activeThread?.messages || [];

  // Save to localStorage
  const saveThreads = (threads: ChatThread[], activeId: string) => {
    setChatThreads(threads);
    setActiveChatId(activeId);
    localStorage.setItem('chat_threads', JSON.stringify(threads));
    localStorage.setItem('active_chat_id', activeId);
  };

  const startNewChat = () => {
    const newId = `chat_${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: 'New Chat',
      messages: []
    };
    saveThreads([newThread, ...chatThreads], newId);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const currentThread = chatThreads.find((t) => t.id === activeChatId);
    if (!currentThread) return;

    const updatedMessages = [...currentThread.messages, userMessage];
    const updatedThreads = chatThreads.map((t) =>
      t.id === currentThread.id ? { ...t, messages: updatedMessages } : t
    );

    // Auto-title the chat
    if (currentThread.title === 'New Chat' && content.length >= 8) {
      const firstLine = content.split('\n')[0].slice(0, 40);
      updatedThreads.find((t) => t.id === currentThread.id)!.title = firstLine;
    }

    saveThreads(updatedThreads, currentThread.id);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    const aiResponse = generateResponse(content, aiTone);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: markdownEnabled ? formatMarkdown(aiResponse) : aiResponse,
      role: 'assistant',
      timestamp: new Date()
    };

    const finalMessages = [...updatedMessages, assistantMessage];
    const finalThreads = chatThreads.map((t) =>
      t.id === currentThread.id ? { ...t, messages: finalMessages } : t
    );

    setIsLoading(false);
    saveThreads(finalThreads, currentThread.id);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const switchToChat = (id: string) => {
    const threadExists = chatThreads.some((t) => t.id === id);
    if (threadExists) {
      setActiveChatId(id);
      localStorage.setItem('active_chat_id', id);
    }
  };

  const deleteChat = (id: string) => {
    const remaining = chatThreads.filter((t) => t.id !== id);
    const newActive = remaining[0]?.id || null;
    saveThreads(remaining, newActive);
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
          chats={chatThreads}
          onSelectChat={switchToChat}
          onDeleteChat={deleteChat}
          onNewChat={startNewChat}
          activeChatId={activeChatId}
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

function generateResponse(input: string, tone: string): string {
  if (tone === 'casual') return "Cool! Here's a quick answer for ya:";
  if (tone === 'theological') return "In light of Catholic theology, we might say:\n\n1. ...\n2. ...";
  return "Thank you for your question. Here's how I see it:";
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>');
}
