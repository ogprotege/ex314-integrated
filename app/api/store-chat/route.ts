// app/api/store-chat/route.ts
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { MessageSchema } from '@/lib/validation/messageSchema';

// Step 1: Define full payload schema
const StoreChatSchema = z.object({
  userId: z.string().min(1),
  chatId: z.string().min(1),
  messages: z.array(MessageSchema)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = StoreChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { userId, chatId, messages } = parsed.data;

    const { error } = await supabase
      .from('chat_messages')
      .upsert({
        user_id: userId,
        chat_id: chatId,
        messages
      });

    if (error) {
      console.error('SUPABASE ERROR:', error);
      return NextResponse.json({ error: 'Supabase storage failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('STORE-CHAT ERROR:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}