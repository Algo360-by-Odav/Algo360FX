import axios from 'axios';

export interface AIAnalysisRequest {
  data: any;
  analysisType: AnalysisType;
  options?: AnalysisOptions;
}

export type AnalysisType = 
  | 'market_analysis'
  | 'pattern_recognition'
  | 'risk_assessment'
  | 'strategy_generation'
  | 'educational_content';

export interface AnalysisOptions {
  timeframe?: string;
  confidence?: number;
  maxResults?: number;
  includeExplanation?: boolean;
  language?: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  result?: any;
  explanation?: string;
  confidence?: number;
  error?: string;
}

class AIService {
  private readonly API_URL: string;
  private readonly DEEPSEEK_API_KEY: string;

  constructor() {
    this.API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    this.DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

    if (!this.DEEPSEEK_API_KEY) {
      console.warn('Deepseek API key not found. AI features will be limited.');
    }
  }

  async analyzeMarket(data: any, options?: AnalysisOptions): Promise<AIAnalysisResponse> {
    return this.analyze({
      data,
      analysisType: 'market_analysis',
      options,
    });
  }

  async recognizePatterns(data: any, options?: AnalysisOptions): Promise<AIAnalysisResponse> {
    return this.analyze({
      data,
      analysisType: 'pattern_recognition',
      options,
    });
  }

  async assessRisk(data: any, options?: AnalysisOptions): Promise<AIAnalysisResponse> {
    return this.analyze({
      data,
      analysisType: 'risk_assessment',
      options,
    });
  }

  async generateStrategy(data: any, options?: AnalysisOptions): Promise<AIAnalysisResponse> {
    return this.analyze({
      data,
      analysisType: 'strategy_generation',
      options,
    });
  }

  async generateEducationalContent(data: any, options?: AnalysisOptions): Promise<AIAnalysisResponse> {
    return this.analyze({
      data,
      analysisType: 'educational_content',
      options,
    });
  }

  private async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      const response = await axios.post(
        `${this.API_URL}/ai/analyze`,
        {
          ...request,
          apiKey: this.DEEPSEEK_API_KEY,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`,
          },
        }
      );

      return {
        success: true,
        ...response.data,
      };
    } catch (error: any) {
      console.error('AI analysis error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'An error occurred during AI analysis',
      };
    }
  }

  async validateAPIKey(apiKey: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.API_URL}/ai/validate-key`,
        { apiKey },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.valid;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }

  async getUsageStatistics(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.API_URL}/ai/usage`,
        {
          headers: {
            'Authorization': `Bearer ${this.DEEPSEEK_API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching AI usage statistics:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
