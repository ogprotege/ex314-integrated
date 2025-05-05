import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

const together = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY!,
  baseURL: 'https://api.together.xyz/v1',
});

export async function POST(req: Request) {
  try {
    const { messages, stream = false, user_id, chat_id } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const model = 'thebiscuit1/Llama-3.3-70B-32k-Instruct-Reference-ex314-ft-p1-round3-0daf7fe8';

    const response = await together.chat.completions.create({
      model,
      messages,
      max_tokens: 16384,
      stream,
    });

    const assistantReply = response.choices[0]?.message?.content ?? '';

    // ✅ Supabase logging
    const supabase = getServiceSupabase();

    if (user_id && chat_id) {
      const now = new Date().toISOString();

      // Insert user message(s)
      const userMessages = messages
        .filter((msg: any) => msg.role === 'user')
        .map((msg: any) => ({
          user_id,
          chat_id,
          role: msg.role,
          content: msg.content,
          timestamp: now,
          model_used: model,
        }));

      // Insert assistant reply
      const assistantMessage = {
        user_id,
        chat_id,
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toISOString(),
        model_used: model,
      };

      await supabase.from('messages').insert([...userMessages, assistantMessage]);
    }

    return NextResponse.json({
      result: assistantReply,
    });
  } catch (err: any) {
    console.error('[Together API Error]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
