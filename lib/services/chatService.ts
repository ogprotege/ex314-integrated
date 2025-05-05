import togetherAIService from './togetherAIService';
import { MessageSchema } from '@/lib/validation/messageSchema';
import type { Message } from '@/lib/validation/messageSchema';

export class ChatService {
  /**
   * Validate and send a chat message to Together AI
   */
  async sendMessage(message: string, context: Message[] = []): Promise<string> {
    const validatedContext = context.filter((msg) => {
      const result = MessageSchema.safeParse(msg);
      return result.success;
    });

    const messages = [
      ...validatedContext.map(({ role, content }) => ({ role, content })),
      { role: 'user', content: message }
    ];

    return await togetherAIService.chatCompletion(messages);
  }

  /**
   * Validate and stream a message to Together AI
   */
  async streamMessage(
    message: string,
    context: Message[] = [],
    onChunk: (chunk: string, fullContent: string) => void
  ): Promise<void> {
    const validatedContext = context.filter((msg) => {
      const result = MessageSchema.safeParse(msg);
      return result.success;
    });

    const messages = [
      ...validatedContext.map(({ role, content }) => ({ role, content })),
      { role: 'user', content: message }
    ];

    await togetherAIService.streamChatCompletion(messages, onChunk);
  }
}
