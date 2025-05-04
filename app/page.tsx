'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { InitialView } from '../components/InitialView';
import { ChatView } from '../components/ChatView';
import { Header } from '../components/Header';
import { useRouter } from 'next/navigation';
import type { Message } from '../lib/types';

export default function Home() {
  // Authentication state (in a real app, use a more robust auth solution)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const router = useRouter();
  
  // Set isClient to true once component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    if (!isClient) return;
    
    // For demo purposes - in a real app, verify auth status from cookies/localStorage
    const isLoggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router, isClient]);

  const handleLogout = () => {
    if (!isClient) return;
    
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
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    let aiResponse = "I understand you're asking about that. Let me help you with this.";
    
    if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi')) {
      aiResponse = 'Hello! How can I assist you today?';
    } else if (content.toLowerCase().includes('help')) {
      aiResponse = "I'm here to help! What specific assistance do you need?";
    } else if (content.toLowerCase().includes('thank')) {
      aiResponse = "You're welcome! Is there anything else you'd like to know?";
    } else if (content.length < 10) {
      aiResponse = "Could you please provide more details about what you'd like to know?";
    } else {
      aiResponse = `Thank you for your detailed query. Let me break this down:
1. First, let's consider the main points you've raised.
2. Based on my analysis, I can help you with this specific situation.
3. Would you like me to provide more detailed information about any particular aspect?`;
    }
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      role: 'assistant',
      timestamp: new Date()
    };
    
    setIsLoading(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  // Show loading during client-side rendering or authentication check
  if (!isClient || !isAuthenticated) {
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
