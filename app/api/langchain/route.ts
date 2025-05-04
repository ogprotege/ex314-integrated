import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: "message" is required' },
        { status: 400 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_LLM_API_URL
    const apiKey = process.env.NEXT_PUBLIC_LLM_API_KEY

    if (!apiUrl) {
      return NextResponse.json(
        { error: 'Missing LLM API URL in environment' },
        { status: 500 }
      )
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` })
      },
      body: JSON.stringify({ message })
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `LLM API error: ${response.status}` },
        { status: 502 }
      )
    }

    const data = await response.json()

    return NextResponse.json({ response: data.response })
  } catch (error) {
    console.error('LangChain API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
