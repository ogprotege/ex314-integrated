// app/api/langchain/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message, context } = await req.json();
  const pastContext = updatedMessages.slice(-10); // 🔁 just change to -25, -50, etc.
  const response = await fetch(process.env.NEXT_PUBLIC_LLM_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_API_KEY}`
    },
    body: JSON.stringify({
      message,
      context // ✅ send last 10 messages for memory-aware logic
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `LLM API failed: ${response.status}` },
      { status: 500 }
    );
  }

  const data = await response.json();
  return NextResponse.json({ response: data.response });
}
