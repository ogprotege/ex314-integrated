import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";
import type { Message } from "../types";

export class ChatService {
  /**
   * Send a chat message to the LLM endpoint and return the response
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

      const response = await fetch('/api/together', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: togetherMessages })
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status}`);
      }

      if (!response.body) throw new Error('No response body');
      
      let fullResponse = '';
      
      // Process the streamed response
      await ChatCompletionStream.fromReadableStream(response.body)
        .on('content', (_, content) => {
          fullResponse = content;
        })
        .on('error', (error) => {
          console.error('Streaming error:', error);
          throw error;
        });
      
      return fullResponse;
    } catch (error) {
      console.error('ChatService.sendMessage error:', error);
      throw error;
    }
  }

  /**
   * Send a streaming request to the LLM endpoint and process response chunks
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

      const response = await fetch('/api/together', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: togetherMessages })
      });

      if (!response.ok) {
        throw new Error(`LLM streaming error: ${response.status}`);
      }

      if (!response.body) throw new Error('No response body');
      
      // Process the streamed response
      ChatCompletionStream.fromReadableStream(response.body)
        .on('content', (delta, content) => {
          onChunk(delta, content);
        })
        .on('error', (error) => {
          console.error('Streaming error:', error);
          throw error;
        });

    } catch (error) {
      console.error('ChatService.streamMessage error:', error);
      throw error;
    }
  }
}
