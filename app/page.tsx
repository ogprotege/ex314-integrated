'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInput } from '@/components/ChatInput';
import { useRouter } from 'next/navigation';
import { useChat } from '@/context/ChatContext';

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const router = useRouter();
  
  const { 
    chats, 
    visibleChats,
    messages, 
    activeChatId, 
    isLoading, 
    sendMessage, 
    newChat, 
    selectChat, 
    updateChat, 
    deleteChat 
  } = useChat();

  useEffect(() => {
    // Check login status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    setIsLoggedIn(isAuthenticated);
    setIsLoaded(true);
    
    // Redirect if not logged in
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  // Handle sidebar toggle
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsLoggedIn(false);
    router.push('/login');
  };
  
  // Handle new chat creation
  const handleNewChat = () => {
    newChat();
  };
  
  // Handle deleting a chat
  const onDeleteChat = (id: string) => {
    deleteChat(id);
  };
  
  // Handle selecting a chat
  const onSelectChat = (id: string) => {
    selectChat(id);
  };
  
  // Handle updating a chat
  const onUpdateChat = (id: string, update: any) => {
    updateChat(id, update);
  };
  
  // If still checking login status or not logged in, show loading
  if (!isLoaded || !isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen bg-dark-bg text-white">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        onLogout={handleLogout}
      />
      
      {/* Main Chat Area */}
      <main className="flex-grow h-full flex flex-col">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6">
          {!activeChatId ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto text-gray-400">
              <h2 className="text-xl font-bold mb-2">Welcome to EX314</h2>
              <p className="mb-6">Start a new chat or select an existing conversation to begin.</p>
              <button 
                onClick={handleNewChat}
                className="bg-accent-purple hover:bg-purple-hover text-white px-4 py-2 rounded-md transition-colors"
              >
                New Chat
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              {messages.map((message, index) => (
                <div 
                  key={message.id} 
                  className={`mb-6 ${message.role === 'assistant' ? 'text-white' : 'text-gray-300'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'assistant' ? 'bg-accent-purple' : 'bg-gray-700'
                    }`}>
                      {message.role === 'assistant' ? '✝' : 'Y'}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm text-gray-500 mb-1 flex justify-between">
                        <span>{message.role === 'assistant' ? 'EX314' : 'You'}</span>
                        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-pulse flex gap-2">
                    <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                    <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                    <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        {activeChatId && (
          <div className="border-t border-[#222222] p-4">
            <ChatInput onSendMessage={sendMessage} />
          </div>
        )}
      </main>
    </div>
  );
}
