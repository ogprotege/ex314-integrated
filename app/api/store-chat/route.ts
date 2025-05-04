// app/api/store-chat/route.ts
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, chatId, messages } = await req.json();

  const { data, error } = await supabase
    .from('chat_messages')
    .upsert({ user_id: userId, chat_id: chatId, messages });

  if (error) {
    console.error('SUPABASE ERROR:', error);
    return NextResponse.json({ error: 'Supabase storage failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
