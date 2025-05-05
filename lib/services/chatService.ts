import { getTogetherAIResponse } from '@/lib/services/chatAPIClient';
import { MessageSchema } from '@/lib/validation/messageSchema';
import type { Message } from '@/lib/validation/messageSchema';

export class ChatService {
  /**
   * Validate and send a chat message to Together AI via API route.
   * Logs both user and assistant messages to Supabase.
   */
  async sendMessage(
    message: string,
    context: Message[] = [],
    userId?: string,
    chatId?: string
  ): Promise<string> {
    const validatedContext = context.filter((msg) =>
      MessageSchema.safeParse(msg).success
    );

    const messages = [
      ...validatedContext.map(({ role, content }) => ({
        role: role as 'user' | 'assistant' | 'system',
        content
      })),
      { role: 'user' as const, content: message }
    ];

    return await getTogetherAIResponse(messages, userId, chatId);
  }

  /**
   * Streaming version — still to be implemented via proxy.
   */
  async streamMessage(
    message: string,
    context: Message[] = [],
    onChunk: (chunk: string, fullContent: string) => void
  ): Promise<void> {
    console.warn('⚠️ streamMessage() not implemented yet with API proxy.');
    throw new Error('streamMessage() not supported yet.');
  }
}
