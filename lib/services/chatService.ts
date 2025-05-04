export class ChatService {
  /**
   * Send a chat message to the LLM endpoint and return the response
   */
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LLM_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.NEXT_PUBLIC_LLM_API_KEY && {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_API_KEY}`
          })
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response; // Adjust if your API returns differently
    } catch (error) {
      console.error('ChatService.sendMessage error:', error);
      throw error;
    }
  }

  /**
   * Send a streaming request to the LLM endpoint and process response chunks
   */
  async streamMessage(message: string, onChunk: (chunk: string) => void): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LLM_API_URL!}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.NEXT_PUBLIC_LLM_API_KEY && {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_API_KEY}`
          })
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`LLM streaming error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream in response');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } catch (error) {
      console.error('ChatService.streamMessage error:', error);
      throw error;
    }
  }
}
