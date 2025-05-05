export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * Send a validated list of chat messages to the Together AI proxy route
 * and return the final AI response.
 *
 * @param messages - array of chat messages to send to Together AI
 * @param user_id - optional user ID for Supabase logging
 * @param chat_id - optional chat ID for Supabase logging
 */
export async function getTogetherAIResponse(
  messages: ChatMessage[],
  user_id?: string,
  chat_id?: string
): Promise<string> {
  const res = await fetch('/api/together', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      stream: false,
      user_id,
      chat_id
    })
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Unknown error from Together AI route');
  }

  const data = await res.json();
  return data.result;
}
