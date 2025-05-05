// /app/api/together/route.ts
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const together = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY!, // ✅ NO NEXT_PUBLIC
  baseURL: 'https://api.together.xyz/v1',
});

export async function POST(req: Request) {
  try {
    const { messages, stream = false } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const response = await together.chat.completions.create({
      model: 'thebiscuit1/Llama-3.3-70B-32k-Instruct-Reference-ex314-ft-p1-round3-0daf7fe8',
      messages,
      max_tokens: 16384,
      stream,
    });

    if (stream) {
      // Streaming response (advanced: you could implement Next.js streaming)
      return NextResponse.json({ error: 'Streaming not yet implemented here' }, { status: 501 });
    }

    return NextResponse.json({
      result: response.choices[0]?.message?.content ?? '',
    });
  } catch (err: any) {
    console.error('[Together API Error]', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
