// app/api/langchain/stream/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, context } = await req.json();

  const response = await fetch(`${process.env.NEXT_PUBLIC_LLM_API_URL}/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_API_KEY}`
    },
    body: JSON.stringify({
      message,
      context // 🧠 Include last 100 messages
    })
  });

  if (!response.ok || !response.body) {
    return new Response('Stream error', { status: 500 });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
