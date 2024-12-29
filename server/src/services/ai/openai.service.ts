import { Configuration, OpenAIApi } from 'openai';
import { logger } from '../../utils/logger';

export class OpenAIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async analyzeMarket(marketData: any, newsData: any) {
    try {
      const prompt = this.constructMarketAnalysisPrompt(marketData, newsData);
      
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert financial analyst AI with deep knowledge of forex, stocks, and market analysis. 
            Provide detailed market analysis using technical and fundamental factors. 
            Format your response in a structured JSON with the following fields:
            {
              "analysis": "detailed market analysis",
              "sentiment": "bullish/bearish/neutral",
              "confidence": 0-1,
              "keyFactors": ["list of key factors"],
              "technicalIndicators": {"indicator": "value"},
              "recommendation": "trading recommendation",
              "risks": ["potential risks"]
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
      });

      return JSON.parse(response.data.choices[0].message?.content || '{}');
    } catch (error) {
      logger.error('Error in OpenAI market analysis:', error);
      throw error;
    }
  }

  async predictPriceMovement(symbol: string, marketData: any, timeframe: string) {
    try {
      const prompt = this.constructPricePredictionPrompt(symbol, marketData, timeframe);
      
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert financial prediction AI. 
            Analyze the market data and provide price predictions with confidence levels.
            Format your response in a structured JSON with the following fields:
            {
              "prediction": {
                "direction": "up/down",
                "priceTarget": number,
                "timeframe": "string",
                "probability": 0-100
              },
              "reasoning": ["list of reasons"],
              "confidence": 0-1,
              "supportLevels": [numbers],
              "resistanceLevels": [numbers]
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
      });

      return JSON.parse(response.data.choices[0].message?.content || '{}');
    } catch (error) {
      logger.error('Error in OpenAI price prediction:', error);
      throw error;
    }
  }

  async generateTradingStrategy(marketData: any, riskProfile: string) {
    try {
      const prompt = this.constructStrategyPrompt(marketData, riskProfile);
      
      const response = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert trading strategy AI.
            Generate detailed trading strategies based on market analysis and risk profile.
            Format your response in a structured JSON with the following fields:
            {
              "strategy": {
                "name": "strategy name",
                "type": "trend/reversal/breakout",
                "timeframe": "trading timeframe",
                "entryConditions": ["list of conditions"],
                "exitConditions": ["list of conditions"],
                "stopLoss": "stop loss strategy",
                "takeProfit": "take profit strategy"
              },
              "riskManagement": {
                "positionSize": "recommended size",
                "maxRiskPerTrade": "percentage",
                "riskRewardRatio": "ratio"
              },
              "confidence": 0-1
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
      });

      return JSON.parse(response.data.choices[0].message?.content || '{}');
    } catch (error) {
      logger.error('Error in OpenAI strategy generation:', error);
      throw error;
    }
  }

  private constructMarketAnalysisPrompt(marketData: any, newsData: any): string {
    return `Analyze the following market data and news:

Market Data:
${JSON.stringify(marketData, null, 2)}

Recent News:
${JSON.stringify(newsData, null, 2)}

Provide a comprehensive market analysis including:
1. Technical analysis of price action and indicators
2. Fundamental analysis based on news and economic data
3. Market sentiment analysis
4. Key risk factors
5. Trading recommendations`;
  }

  private constructPricePredictionPrompt(symbol: string, marketData: any, timeframe: string): string {
    return `Predict price movement for ${symbol} over ${timeframe} timeframe.

Market Data:
${JSON.stringify(marketData, null, 2)}

Consider:
1. Current price trends and patterns
2. Technical indicators
3. Support and resistance levels
4. Market sentiment
5. Recent price action`;
  }

  private constructStrategyPrompt(marketData: any, riskProfile: string): string {
    return `Generate a trading strategy for a ${riskProfile} risk profile.

Market Data:
${JSON.stringify(marketData, null, 2)}

Requirements:
1. Clear entry and exit conditions
2. Risk management rules
3. Position sizing recommendations
4. Stop loss and take profit strategies
5. Timeframe-specific guidelines`;
  }
}
