import { OpenAI } from 'openai';

const together = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_AI_API_KEY || '',
  baseURL: 'https://api.together.xyz/v1',
});

export type ChatCompletionMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export class TogetherAIService {
  private model = 'thebiscuit1/Llama-3.3-70B-32k-Instruct-Reference-ex314-ft-p1-round3-0daf7fe8';

  /**
   * Sends a full chat request and returns the assistant response.
   */
  async chatCompletion(messages: ChatCompletionMessage[]): Promise<string> {
    try {
      const response = await together.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 16384,
      });

      return response.choices[0]?.message?.content ?? '';
    } catch (error) {
      console.error('TogetherAIService.chatCompletion error:', error);
      throw error;
    }
  }

  /**
   * Sends a streaming chat request and yields response chunks.
   */
  async streamChatCompletion(
    messages: ChatCompletionMessage[],
    onChunk: (chunk: string, fullContent: string) => void
  ): Promise<void> {
    try {
      const stream = await together.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 16384,
        stream: true,
      });

      let fullContent = '';
      for await (const chunk of stream) {
        const contentPart = chunk.choices[0]?.delta?.content || '';
        fullContent += contentPart;
        onChunk(contentPart, fullContent);
      }
    } catch (error) {
      console.error('TogetherAIService.streamChatCompletion error:', error);
      throw error;
    }
  }
}

export default new TogetherAIService();