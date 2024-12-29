import { MarketDataService } from './marketData.service';
import { TechnicalAnalysisService } from './technicalAnalysis.service';
import { FundamentalAnalysisService } from './fundamentalAnalysis.service';
import { RiskManagementService } from './riskManagement.service';
import { OpenAIService } from './ai/openai.service';
import { MarketPredictionService } from './ai/marketPrediction.service';
import { logger } from '../utils/logger';

interface AIResponse {
  message: string;
  type: 'analysis' | 'signal' | 'market' | 'general' | 'prediction';
  confidence: number;
  charts?: any[];
  metadata?: {
    symbol?: string;
    timeframe?: string;
    indicators?: string[];
    sentiment?: 'bullish' | 'bearish' | 'neutral';
    prediction?: {
      price?: number;
      timeframe?: string;
      probability?: number;
    };
    analysis?: {
      technicalScore?: number;
      fundamentalScore?: number;
      marketSentiment?: string;
      riskLevel?: 'low' | 'medium' | 'high';
    };
  };
}

interface ChatContext {
  previousMessages: any[];
  user: any;
  selectedMarkets: string[];
  timeframe: string;
}

export class AIAssistantService {
  private marketDataService: MarketDataService;
  private technicalAnalysisService: TechnicalAnalysisService;
  private fundamentalAnalysisService: FundamentalAnalysisService;
  private riskManagementService: RiskManagementService;
  private openAIService: OpenAIService;
  private marketPredictionService: MarketPredictionService;

  constructor() {
    this.marketDataService = new MarketDataService();
    this.technicalAnalysisService = new TechnicalAnalysisService();
    this.fundamentalAnalysisService = new FundamentalAnalysisService();
    this.riskManagementService = new RiskManagementService();
    this.openAIService = new OpenAIService();
    this.marketPredictionService = new MarketPredictionService();
  }

  async processChat(message: string, context: ChatContext): Promise<AIResponse> {
    try {
      // Get market data for context
      const marketData = await this.marketDataService.getMarketData(
        context.selectedMarkets,
        context.timeframe
      );

      // Get AI analysis of the message and market data
      const aiAnalysis = await this.openAIService.analyzeMarket(
        marketData,
        await this.getRelevantNews(context.selectedMarkets)
      );

      // Process based on AI analysis
      switch (aiAnalysis.intent) {
        case 'market_analysis':
          return await this.handleMarketAnalysis(message, context, aiAnalysis);
        case 'price_prediction':
          return await this.handlePricePrediction(message, context);
        case 'trading_signal':
          return await this.handleTradingSignal(message, context, aiAnalysis);
        case 'risk_assessment':
          return await this.handleRiskAssessment(message, context);
        default:
          return await this.handleGeneralQuery(message, context, aiAnalysis);
      }
    } catch (error) {
      logger.error('Error in AI Assistant:', error);
      return {
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        type: 'general',
        confidence: 0
      };
    }
  }

  private async handleMarketAnalysis(message: string, context: ChatContext, aiAnalysis: any): Promise<AIResponse> {
    const { selectedMarkets, timeframe } = context;
    
    // Get technical analysis
    const technicalAnalysis = await this.technicalAnalysisService.analyzeMarkets(
      selectedMarkets,
      timeframe
    );

    // Get fundamental analysis
    const fundamentalAnalysis = await this.fundamentalAnalysisService.analyzeMarkets(
      selectedMarkets
    );

    // Combine analyses with AI insights
    const combinedAnalysis = {
      ...this.combineAnalyses(technicalAnalysis, fundamentalAnalysis),
      aiInsights: aiAnalysis
    };

    return {
      message: this.formatAnalysisResponse(combinedAnalysis),
      type: 'analysis',
      confidence: combinedAnalysis.confidence,
      charts: combinedAnalysis.charts,
      metadata: {
        symbol: selectedMarkets[0],
        timeframe,
        indicators: combinedAnalysis.indicators,
        sentiment: aiAnalysis.sentiment,
        analysis: {
          technicalScore: combinedAnalysis.technicalScore,
          fundamentalScore: combinedAnalysis.fundamentalScore,
          marketSentiment: aiAnalysis.marketSentiment,
          riskLevel: combinedAnalysis.riskLevel
        }
      }
    };
  }

  private async handlePricePrediction(message: string, context: ChatContext): Promise<AIResponse> {
    const { selectedMarkets, timeframe } = context;
    
    // Get AI prediction
    const prediction = await this.marketPredictionService.generateMarketPrediction(
      selectedMarkets[0],
      timeframe
    );

    return {
      message: this.formatPredictionResponse(prediction),
      type: 'prediction',
      confidence: prediction.confidence,
      charts: prediction.charts,
      metadata: {
        symbol: selectedMarkets[0],
        timeframe,
        prediction: {
          price: prediction.prediction.priceTarget,
          timeframe: prediction.timeframe,
          probability: prediction.prediction.probability
        }
      }
    };
  }

  private async handleTradingSignal(message: string, context: ChatContext, aiAnalysis: any): Promise<AIResponse> {
    const { selectedMarkets, timeframe } = context;
    
    // Get trading signals
    const signals = await this.technicalAnalysisService.generateSignals(
      selectedMarkets,
      timeframe
    );

    // Get AI strategy recommendation
    const strategy = await this.marketPredictionService.generateStrategyRecommendation(
      selectedMarkets[0],
      'moderate'  // You can make this dynamic based on user preferences
    );

    // Combine signals with AI strategy
    const enhancedSignal = {
      ...signals,
      strategy: strategy.strategy,
      riskManagement: strategy.riskManagement
    };

    return {
      message: this.formatSignalResponse(enhancedSignal),
      type: 'signal',
      confidence: Math.min(signals.confidence, strategy.confidence),
      charts: signals.charts,
      metadata: {
        symbol: selectedMarkets[0],
        timeframe,
        sentiment: aiAnalysis.sentiment,
        indicators: signals.indicators
      }
    };
  }

  private async handleRiskAssessment(message: string, context: ChatContext): Promise<AIResponse> {
    const { selectedMarkets } = context;
    
    // Get risk assessment
    const riskAnalysis = await this.riskManagementService.assessRisk(
      selectedMarkets[0]
    );

    // Get AI strategy with risk focus
    const strategy = await this.marketPredictionService.generateStrategyRecommendation(
      selectedMarkets[0],
      'conservative'
    );

    // Combine risk analysis with AI insights
    const enhancedRiskAnalysis = {
      ...riskAnalysis,
      strategy: strategy.strategy,
      riskManagement: strategy.riskManagement
    };

    return {
      message: this.formatRiskResponse(enhancedRiskAnalysis),
      type: 'analysis',
      confidence: Math.min(riskAnalysis.confidence, strategy.confidence),
      metadata: {
        symbol: selectedMarkets[0],
        analysis: {
          riskLevel: riskAnalysis.riskLevel,
          marketSentiment: riskAnalysis.marketSentiment
        }
      }
    };
  }

  private async handleGeneralQuery(message: string, context: ChatContext, aiAnalysis: any): Promise<AIResponse> {
    return {
      message: aiAnalysis.analysis,
      type: 'general',
      confidence: aiAnalysis.confidence,
      metadata: {
        sentiment: aiAnalysis.sentiment,
        analysis: {
          marketSentiment: aiAnalysis.marketSentiment
        }
      }
    };
  }

  private async getRelevantNews(symbols: string[]) {
    // Implement news fetching logic
    return [];
  }

  private combineAnalyses(technical: any, fundamental: any) {
    return {
      ...technical,
      ...fundamental,
      confidence: (technical.confidence + fundamental.confidence) / 2
    };
  }

  private formatAnalysisResponse(analysis: any): string {
    return `Based on my comprehensive analysis of ${analysis.symbol}:

Technical Analysis:
• Overall Score: ${analysis.technicalScore}/100
• Key Indicators: ${analysis.indicators.join(', ')}
• Trend Direction: ${analysis.trend}

Fundamental Analysis:
• Market Sentiment: ${analysis.marketSentiment}
• Risk Level: ${analysis.riskLevel}
• Key Factors: ${analysis.keyFactors.join(', ')}

AI Insights:
${analysis.aiInsights.analysis}

Recommendation:
${analysis.recommendation}

Confidence Level: ${(analysis.confidence * 100).toFixed(1)}%`;
  }

  private formatPredictionResponse(prediction: any): string {
    return `Price Prediction for ${prediction.symbol}:

Forecast:
• Direction: ${prediction.prediction.direction}
• Target Price: ${prediction.prediction.priceTarget}
• Timeframe: ${prediction.timeframe}
• Probability: ${prediction.prediction.probability}%

Technical Analysis:
• Trend Strength: ${prediction.technicalAnalysis.trendStrength.value} (${prediction.technicalAnalysis.trendStrength.direction})
• Volatility: ${prediction.technicalAnalysis.volatility.value}%

Key Levels:
• Support: ${prediction.technicalAnalysis.keyLevels.support.join(', ')}
• Resistance: ${prediction.technicalAnalysis.keyLevels.resistance.join(', ')}

Reasoning:
${prediction.reasoning.map((reason: string) => `• ${reason}`).join('\n')}

Note: This prediction is based on technical analysis, market conditions, and AI insights.
Always practice proper risk management.`;
  }

  private formatSignalResponse(signal: any): string {
    return `Trading Signal Alert for ${signal.symbol}:

Signal Type: ${signal.type}
Direction: ${signal.direction}
Strength: ${signal.strength}/10

Entry Points:
• Ideal Entry: ${signal.entry}
• Stop Loss: ${signal.stopLoss}
• Take Profit: ${signal.takeProfit}

Strategy Recommendation:
• Type: ${signal.strategy.type}
• Timeframe: ${signal.strategy.timeframe}

Entry Conditions:
${signal.strategy.entryConditions.map((condition: string) => `• ${condition}`).join('\n')}

Exit Conditions:
${signal.strategy.exitConditions.map((condition: string) => `• ${condition}`).join('\n')}

Risk Management:
• Position Size: ${signal.riskManagement.positionSize}
• Max Risk per Trade: ${signal.riskManagement.maxRiskPerTrade}
• Risk/Reward Ratio: ${signal.riskManagement.riskRewardRatio}

Supporting Indicators:
${signal.indicators.map((ind: any) => `• ${ind.name}: ${ind.value}`).join('\n')}

Confidence Level: ${(signal.confidence * 100).toFixed(1)}%`;
  }

  private formatRiskResponse(risk: any): string {
    return `Risk Assessment for ${risk.symbol}:

Risk Level: ${risk.riskLevel}
Market Volatility: ${risk.volatility}

Key Risk Factors:
${risk.factors.map((factor: string) => `• ${factor}`).join('\n')}

Risk Management Strategy:
• Position Size: ${risk.strategy.riskManagement.positionSize}
• Stop Loss Strategy: ${risk.strategy.stopLoss}
• Risk/Reward Ratio: ${risk.riskManagement.riskRewardRatio}

Recommended Approach:
${risk.strategy.entryConditions.map((condition: string) => `• ${condition}`).join('\n')}

Protective Measures:
• Stop Loss: ${risk.recommendedStopLoss}
• Position Sizing: ${risk.recommendedSize}
• Risk/Reward: ${risk.riskRewardRatio}`;
  }
}
