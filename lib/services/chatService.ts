import togetherAIService from './togetherAIService';
import type { Message } from "../types";

export class ChatService {
  /**
   * Send a chat message to the Together AI endpoint and return the response
   */
  async sendMessage(message: string, context: Message[] = []): Promise<string> {
    try {
      // Convert your existing messages format to Together's format
      const togetherMessages = context.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the current message
      togetherMessages.push({
        role: 'user',
        content: message
      });
      // Use the Together AI service
      return await togetherAIService.chatCompletion(togetherMessages);
    } catch (error) {
      console.error('ChatService.sendMessage error:', error);
      throw error;
    }
  }

  /**
   * Send a streaming request to the Together AI endpoint and process response chunks
   */
  async streamMessage(
    message: string, 
    context: Message[] = [], 
    onChunk: (chunk: string, fullContent: string) => void
  ): Promise<void> {
    try {
      // Convert your existing messages format to Together's format
      const togetherMessages = context.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the current message
      togetherMessages.push({
        role: 'user',
        content: message
      });
      // Use the Together AI service for streaming
      await togetherAIService.streamChatCompletion(
        togetherMessages,
        onChunk
      );
    } catch (error) {
      console.error('ChatService.streamMessage error:', error);
      throw error;
    }
  }
}
