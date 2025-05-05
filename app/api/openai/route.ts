import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Server-side only — NEVER use in client code!
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // or TOGETHER_API_KEY
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1', // or Together's URL
});

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'gpt-3.5-turbo', max_tokens = 1000 } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid messages' }, { status: 400 });
    }

    const chatResponse = await openai.chat.completions.create({
      model,
      messages,
      max_tokens,
    });

    return NextResponse.json({
      result: chatResponse.choices[0].message?.content ?? '',
    });
  } catch (err: any) {
    console.error('[OpenAI Error]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
