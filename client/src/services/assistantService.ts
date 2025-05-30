import { apiService } from './api';

const ASSISTANT_KNOWLEDGE = {
  trading: {
    features: [
      'Real-time trading execution',
      'Multiple order types (Market, Limit, Stop, etc.)',
      'Position management',
      'Trade history tracking',
      'Advanced charting tools',
      'MetaTrader 5 integration',
      'High-Frequency Trading capabilities',
    ],
    platforms: ['MT5', 'HFT Platform', 'Advanced Trading Interface'],
  },
  portfolio: {
    features: [
      'Multi-currency portfolio management',
      'Real-time portfolio valuation',
      'Performance analytics',
      'Risk metrics',
      'Portfolio rebalancing tools',
    ],
  },
  analysis: {
    features: [
      'Technical analysis tools',
      'Machine learning predictions',
      'Market sentiment analysis',
      'Historical data analysis',
      'Pattern recognition',
    ],
  },
  riskManagement: {
    features: [
      'Position sizing calculator',
      'Risk-reward ratio tools',
      'Stop-loss management',
      'Exposure analysis',
      'Risk reporting',
    ],
  },
  nft: {
    features: [
      'NFT trading marketplace',
      'Digital asset management',
      'NFT portfolio tracking',
      'Trading history',
    ],
  },
  education: {
    features: [
      'Trading academy',
      'Video tutorials',
      'Trading guides',
      'Market analysis reports',
      'Expert webinars',
    ],
  },
  account: {
    features: [
      'Account management',
      'Profile settings',
      'Security features',
      'API key management',
      'Subscription management',
    ],
    support: {
      email: 'support@algo360fx.com',
      hours: '24/7',
      channels: ['Email', 'Live Chat', 'Phone Support'],
    },
  },
};

const SYSTEM_PROMPT = `You are the customer service assistant for Algo360FX, a comprehensive trading platform. Your role is to help users understand and use our platform's features.

Key Guidelines:
1. ONLY answer questions about Algo360FX features and functionality
2. If asked about anything unrelated to Algo360FX, politely redirect to platform topics
3. For technical issues, direct users to support@algo360fx.com
4. For account-specific issues, refer to account managers
5. Use clear, professional language
6. Provide specific, accurate information about platform features
7. Don't make promises about future features or returns
8. Don't provide trading advice or market predictions

Available Features:
${JSON.stringify(ASSISTANT_KNOWLEDGE, null, 2)}

Common Responses:
- For technical issues: "Please contact our support team at support@algo360fx.com for immediate assistance."
- For account issues: "For account-specific inquiries, please reach out to your dedicated account manager."
- For trading advice: "While I can explain how to use our trading tools, I cannot provide specific trading advice. Please consult with a licensed financial advisor."
- For unrelated topics: "I'm focused on helping you with Algo360FX platform features. How can I assist you with our trading tools?"`;

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AssistantService {
  private static instance: AssistantService;
  private baseUrl = '/assistant';

  private constructor() {}

  public static getInstance(): AssistantService {
    if (!AssistantService.instance) {
      AssistantService.instance = new AssistantService();
    }
    return AssistantService.instance;
  }

  async getResponse(messages: AssistantMessage[]): Promise<string> {
    try {
      const response = await apiService.post(`${this.baseUrl}/chat`, {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      });
      return response.message;
    } catch (error) {
      console.error('Assistant service error:', error);
      throw error;
    }
  }

  getKnowledgeBase() {
    return ASSISTANT_KNOWLEDGE;
  }

  getSystemPrompt() {
    return SYSTEM_PROMPT;
  }
}

export const assistantService = AssistantService.getInstance();
