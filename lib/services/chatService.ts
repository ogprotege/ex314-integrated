export type ChatServiceConfig = {
  apiUrl: string;
  apiKey?: string;
  // Add any other configuration options your LLM needs
};
export class ChatService {
  private config: ChatServiceConfig;
  constructor(config: ChatServiceConfig) {
    this.config = config;
  }
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`
          })
        },
        body: JSON.stringify({
          message
          // Add any other parameters your LLM API needs
        })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data.response; // Adjust this based on your API response structure
    } catch (error) {
      console.error("Chat service error:", error);
      throw error;
    }
  }
  // Add method for streaming responses if your LLM supports it
  async streamMessage(message: string, onChunk: (chunk: string) => void): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiUrl}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`
          })
        },
        body: JSON.stringify({
          message
          // Add any other parameters your LLM API needs
        })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        // Assuming the stream is text. Adjust parsing based on your API
        const chunk = new TextDecoder().decode(value);
        onChunk(chunk);
      }
    } catch (error) {
      console.error("Stream error:", error);
      throw error;
    }
  }
}
