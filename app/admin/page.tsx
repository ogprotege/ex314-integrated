// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('messages').select('*').order('timestamp');
      if (data) setMessages(data);
      if (error) console.error(error);
    };
    load();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🛡️ Admin Chat Viewer</h1>
      <ul className="space-y-3">
        {messages.map((msg: any) => (
          <li key={msg.id} className="p-3 rounded bg-card-bg border border-border-color">
            <div className="text-sm text-gray-custom">[{msg.role}] {msg.timestamp}</div>
            <div className="text-white">{msg.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
