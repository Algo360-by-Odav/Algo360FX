import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(messages: ChatMessage[]) {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-4',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices[0].message;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }
}

// Create a singleton instance
let openAIService: OpenAIService | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openAIService = new OpenAIService(apiKey);
};

export const getOpenAIService = () => {
  if (!openAIService) {
    throw new Error('OpenAI service not initialized. Call initializeOpenAI first.');
  }
  return openAIService;
};
