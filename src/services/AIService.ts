import axios from 'axios';

interface AIResponse {
  text: string;
  type: 'analysis' | 'signal' | 'market' | 'general';
  confidence: number;
  metadata?: {
    symbols?: string[];
    timeframe?: string;
    indicators?: string[];
    sentiment?: 'bullish' | 'bearish' | 'neutral';
  };
}

class AIService {
  private static instance: AIService;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  private constructor() {
    this.baseUrl = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:3001/ai';
    this.apiKey = process.env.REACT_APP_AI_SERVICE_KEY || '';
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async analyzeMarket(query: string): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/analyze`,
        { query },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error analyzing market:', error);
      throw error;
    }
  }

  public async generateTradingSignal(symbol: string, timeframe: string): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/signal`,
        { symbol, timeframe },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating trading signal:', error);
      throw error;
    }
  }

  public async analyzeTechnicals(symbol: string, indicators: string[]): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/technicals`,
        { symbol, indicators },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error analyzing technicals:', error);
      throw error;
    }
  }

  public async getSentimentAnalysis(symbols: string[]): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/sentiment`,
        { symbols },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting sentiment analysis:', error);
      throw error;
    }
  }

  public async getRiskAssessment(position: {
    symbol: string;
    type: 'long' | 'short';
    entry: number;
    stopLoss: number;
    takeProfit: number;
    size: number;
  }): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/risk`,
        position,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting risk assessment:', error);
      throw error;
    }
  }

  public async optimizeStrategy(strategy: {
    indicators: string[];
    parameters: Record<string, number>;
    timeframe: string;
    symbol: string;
  }): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/optimize`,
        strategy,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error optimizing strategy:', error);
      throw error;
    }
  }
}

export default AIService;
