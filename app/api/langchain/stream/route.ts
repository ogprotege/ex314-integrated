import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  const apiUrl = process.env.NEXT_PUBLIC_LLM_API_URL
  const apiKey = process.env.NEXT_PUBLIC_LLM_API_KEY

  if (!apiUrl) {
    return new Response('Missing LLM API URL', { status: 500 })
  }

  const upstream = await fetch(`${apiUrl}/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { Authorization: `Bearer ${apiKey}` })
    },
    body: JSON.stringify({ message })
  })

  if (!upstream.ok || !upstream.body) {
    return new Response('Upstream error', { status: 502 })
  }

  const readableStream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(new TextEncoder().encode(decoder.decode(value)))
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.close()
      }
    }
  })

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}
