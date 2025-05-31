import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Supported AI model providers
export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'meta';

// Interface for chat messages
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Interface for model configuration
export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  apiUrl: string;
  maxTokens: number;
  temperature: number;
}

// Model configurations
export const AI_MODELS: Record<string, ModelConfig> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    apiUrl: OPENAI_API_URL,
    maxTokens: 4000,
    temperature: 0.7
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    apiUrl: OPENAI_API_URL,
    maxTokens: 2000,
    temperature: 0.7
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    apiUrl: OPENAI_API_URL,
    maxTokens: 2000,
    temperature: 0.7
  },
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    apiUrl: ANTHROPIC_API_URL,
    maxTokens: 4000,
    temperature: 0.7
  },
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    apiUrl: ANTHROPIC_API_URL,
    maxTokens: 4000,
    temperature: 0.7
  },
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    apiUrl: GOOGLE_API_URL,
    maxTokens: 2048,
    temperature: 0.7
  },
  'mistral-large': {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'mistral',
    apiUrl: MISTRAL_API_URL,
    maxTokens: 2048,
    temperature: 0.7
  }
};

export class OpenAIService {
  private apiKey: string;
  private modelId: string = 'gpt-4';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  setModel(modelId: string) {
    if (AI_MODELS[modelId]) {
      this.modelId = modelId;
      return true;
    }
    return false;
  }

  async sendMessage(messages: ChatMessage[]) {
    try {
      const modelConfig = AI_MODELS[this.modelId] || AI_MODELS['gpt-4'];
      
      // OpenAI models
      if (modelConfig.provider === 'openai') {
        const response = await axios.post(
          OPENAI_API_URL,
          {
            model: this.modelId,
            messages,
            temperature: modelConfig.temperature,
            max_tokens: modelConfig.maxTokens,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
          }
        );
        
        // Return just the assistant's message
        return response.data.choices[0].message.content;
      } 
      // Anthropic models (Claude)
      else if (modelConfig.provider === 'anthropic') {
        const response = await axios.post(
          ANTHROPIC_API_URL,
          {
            model: this.modelId,
            messages: messages.map(msg => ({
              role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
              content: msg.content
            })),
            max_tokens: modelConfig.maxTokens,
            temperature: modelConfig.temperature
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01',
              'x-api-key': this.apiKey
            },
          }
        );
        
        return response.data.content[0].text;
      }
      // Google models (Gemini)
      else if (modelConfig.provider === 'google') {
        // Format messages for Gemini API
        const formattedContent = messages.map(msg => {
          return {
            role: msg.role === 'assistant' ? 'model' : msg.role === 'system' ? 'user' : 'user',
            parts: [{ text: msg.content }]
          };
        });
        
        const response = await axios.post(
          GOOGLE_API_URL,
          {
            contents: formattedContent,
            generationConfig: {
              temperature: modelConfig.temperature,
              maxOutputTokens: modelConfig.maxTokens,
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`
            },
          }
        );
        
        return response.data.candidates[0].content.parts[0].text;
      }
      // Mistral models
      else if (modelConfig.provider === 'mistral') {
        const response = await axios.post(
          MISTRAL_API_URL,
          {
            model: this.modelId,
            messages: messages.map(msg => ({
              role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
              content: msg.content
            })),
            max_tokens: modelConfig.maxTokens,
            temperature: modelConfig.temperature
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`
            },
          }
        );
        
        return response.data.choices[0].message.content;
      }
      // Fallback to OpenAI if provider not supported
      else {
        const response = await axios.post(
          OPENAI_API_URL,
          {
            model: 'gpt-3.5-turbo', // Fallback model
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
        
        return response.data.choices[0].message.content;
      }
    } catch (error) {
      console.error(`Error sending message to AI (${this.modelId}):`, error);
      throw new Error('Failed to get response from AI service');
    }
  }
}

// Create a singleton instance
let openAIService: OpenAIService | null = null;

export function initializeOpenAI(apiKey: string) {
  openAIService = new OpenAIService(apiKey);
}

export function setAIModel(modelId: string) {
  if (!openAIService) {
    throw new Error('AI service not initialized');
  }
  return openAIService.setModel(modelId);
}

export function getOpenAIService() {
  if (!openAIService) {
    throw new Error('AI service not initialized');
  }
  return openAIService;
}
