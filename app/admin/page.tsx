'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  role: string;
  timestamp: string;
}

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once component is mounted
    setIsClient(true);
    
    // Now safe to access browser APIs
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('user_id');
      if (userId === 'admin') {
        setIsAdmin(true);
      }

      const load = async () => {
        const { data, error } = await supabase.from('messages').select('*').order('timestamp');
        if (data) setMessages(data);
        if (error) console.error(error);
      };
      load();
    }
  }, []);

  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-gray-700 rounded-lg p-4">
          <h2 className="text-xl mb-4">Message Stats</h2>
          <p>Total Messages: <span className="font-bold">{messages.length}</span></p>
          <p>Users: <span className="font-bold">{new Set(messages.map(m => m.user_id)).size}</span></p>
          <p>Chats: <span className="font-bold">{new Set(messages.map(m => m.chat_id)).size}</span></p>
        </div>
        
        <div className="border border-gray-700 rounded-lg p-4">
          <h2 className="text-xl mb-4">Recent Messages</h2>
          <div className="max-h-[400px] overflow-y-auto">
            {messages.slice(-10).reverse().map(msg => (
              <div key={msg.id} className="mb-3 border-b border-gray-700 pb-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{msg.role}</span>
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm truncate">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
