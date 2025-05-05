export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * Send a validated list of chat messages to the Together AI proxy route
 * and return the final AI response.
 */
export async function getTogetherAIResponse(
  messages: ChatMessage[]
): Promise<string> {
  const res = await fetch('/api/together', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      stream: false
    })
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Unknown error from Together AI route');
  }

  const data = await res.json();
  return data.result;
}
