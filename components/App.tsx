import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { InitialView } from './components/InitialView';
import { ChatView } from './components/ChatView';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { ChatService } from './lib/services/chatService';
export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};
// Initialize chat service with your LLM API configuration
const chatService = new ChatService({
  apiUrl: 'YOUR_LLM_API_URL',
  apiKey: 'YOUR_API_KEY' // Replace with your actual API key
});
export function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const handleLogin = (username: string, password: string) => {
    // Simple mock authentication for preview purposes
    if (username === 'demo' && password === 'password') {
      setIsAuthenticated(true);
      setLoginError(undefined);
    } else {
      setLoginError('Invalid username or password. Try demo/password');
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
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
    try {
      // Use the chat service to get response from your LLM
      const aiResponse = await chatService.sendMessage(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // Handle error appropriately - maybe show an error message to user
    } finally {
      setIsLoading(false);
    }
  };
  // For preview purposes, show login page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }
  return <div className="flex flex-col w-full h-screen bg-dark-bg text-white font-segoe">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} onLogout={handleLogout} />
        <main className="flex-grow flex flex-col h-full overflow-hidden">
          <Header />
          {messages.length === 0 ? <InitialView onSendMessage={handleSendMessage} /> : <ChatView messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />}
        </main>
      </div>
    </div>;
}
