import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";

// Initialize the Together client with OpenAI compatibility
const together = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_AI_API_KEY || "",
  baseURL: "https://api.together.xyz/v1",
});

export class TogetherAIService {
  // Model to use - you can change this based on your needs
  private model = "thebiscuit1/Llama-3.3-70B-32k-Instruct-Reference-ex314-ft-p1-round3-0daf7fe8";
  
  /**
   * Generate text completion
   */
  async generateCompletion(prompt: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: together(this.model),
        prompt: prompt,
        maxTokens: 1000,
      });
      
      return text;
    } catch (error) {
      console.error("Error generating completion:", error);
      throw error;
    }
  }
  
  /**
   * Stream text completion
   */
  async streamCompletion(
    prompt: string, 
    onChunk: (chunk: string, fullContent: string) => void
  ): Promise<void> {
    try {
      const result = await streamText({
        model: together(this.model),
        prompt: prompt,
        maxTokens: 2000,
      });
      
      let fullContent = "";
      
      for await (const textPart of result.textStream) {
        fullContent += textPart;
        onChunk(textPart, fullContent);
      }
    } catch (error) {
      console.error("Error streaming completion:", error);
      throw error;
    }
  }
  
  /**
   * Chat completion with message history
   */
  async chatCompletion(messages: { role: string; content: string }[]): Promise<string> {
    try {
      // Format messages for Together AI
      const { text } = await generateText({
        model: together(this.model),
        messages: messages,
        maxTokens: 1000,
      });
      
      return text;
    } catch (error) {
      console.error("Error generating chat completion:", error);
      throw error;
    }
  }
  
  /**
   * Stream chat completion with message history
   */
  async streamChatCompletion(
    messages: { role: string; content: string }[],
    onChunk: (chunk: string, fullContent: string) => void
  ): Promise<void> {
    try {
      const result = await streamText({
        model: together(this.model),
        messages: messages,
        maxTokens: 2000,
      });
      
      let fullContent = "";
      
      for await (const textPart of result.textStream) {
        fullContent += textPart;
        onChunk(textPart, fullContent);
      }
    } catch (error) {
      console.error("Error streaming chat completion:", error);
      throw error;
    }
  }
}

export default new TogetherAIService();
