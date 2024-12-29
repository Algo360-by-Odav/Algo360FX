import axios from 'axios';
import { MarketDataService } from './marketData.service';
import { TechnicalAnalysisService } from './technicalAnalysis.service';
import { FundamentalAnalysisService } from './fundamentalAnalysis.service';
import { RiskManagementService } from './riskManagement.service';
import { PredictionService } from './prediction.service';

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
  private predictionService: PredictionService;

  constructor() {
    this.marketDataService = new MarketDataService();
    this.technicalAnalysisService = new TechnicalAnalysisService();
    this.fundamentalAnalysisService = new FundamentalAnalysisService();
    this.riskManagementService = new RiskManagementService();
    this.predictionService = new PredictionService();
  }

  async processChat(message: string, context: ChatContext): Promise<AIResponse> {
    try {
      // Analyze intent
      const intent = await this.analyzeIntent(message);
      
      // Process based on intent
      switch (intent) {
        case 'market_analysis':
          return await this.handleMarketAnalysis(message, context);
        case 'trading_signal':
          return await this.handleTradingSignal(message, context);
        case 'price_prediction':
          return await this.handlePricePrediction(message, context);
        case 'risk_assessment':
          return await this.handleRiskAssessment(message, context);
        default:
          return await this.handleGeneralQuery(message, context);
      }
    } catch (error) {
      console.error('Error in AI Assistant:', error);
      return {
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        type: 'general',
        confidence: 0
      };
    }
  }

  private async analyzeIntent(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('predict') || lowerMessage.includes('forecast')) {
      return 'price_prediction';
    }
    if (lowerMessage.includes('analysis') || lowerMessage.includes('analyze')) {
      return 'market_analysis';
    }
    if (lowerMessage.includes('signal') || lowerMessage.includes('opportunity')) {
      return 'trading_signal';
    }
    if (lowerMessage.includes('risk') || lowerMessage.includes('safety')) {
      return 'risk_assessment';
    }
    
    return 'general';
  }

  private async handleMarketAnalysis(message: string, context: ChatContext): Promise<AIResponse> {
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

    // Combine analyses
    const combinedAnalysis = this.combineAnalyses(technicalAnalysis, fundamentalAnalysis);

    return {
      message: this.formatAnalysisResponse(combinedAnalysis),
      type: 'analysis',
      confidence: combinedAnalysis.confidence,
      charts: combinedAnalysis.charts,
      metadata: {
        symbol: selectedMarkets[0],
        timeframe,
        indicators: combinedAnalysis.indicators,
        sentiment: combinedAnalysis.sentiment,
        analysis: {
          technicalScore: combinedAnalysis.technicalScore,
          fundamentalScore: combinedAnalysis.fundamentalScore,
          marketSentiment: combinedAnalysis.marketSentiment,
          riskLevel: combinedAnalysis.riskLevel
        }
      }
    };
  }

  private async handleTradingSignal(message: string, context: ChatContext): Promise<AIResponse> {
    const { selectedMarkets, timeframe } = context;
    
    // Get trading signals
    const signals = await this.technicalAnalysisService.generateSignals(
      selectedMarkets,
      timeframe
    );

    // Analyze signal strength
    const signalAnalysis = await this.analyzeSignalStrength(signals);

    return {
      message: this.formatSignalResponse(signalAnalysis),
      type: 'signal',
      confidence: signalAnalysis.confidence,
      charts: signalAnalysis.charts,
      metadata: {
        symbol: selectedMarkets[0],
        timeframe,
        sentiment: signalAnalysis.sentiment,
        indicators: signalAnalysis.indicators
      }
    };
  }

  private async handlePricePrediction(message: string, context: ChatContext): Promise<AIResponse> {
    const { selectedMarkets, timeframe } = context;
    
    // Get price prediction
    const prediction = await this.predictionService.predictPrice(
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
          price: prediction.price,
          timeframe: prediction.timeframe,
          probability: prediction.probability
        }
      }
    };
  }

  private async handleRiskAssessment(message: string, context: ChatContext): Promise<AIResponse> {
    const { selectedMarkets } = context;
    
    // Get risk assessment
    const riskAnalysis = await this.riskManagementService.assessRisk(
      selectedMarkets[0]
    );

    return {
      message: this.formatRiskResponse(riskAnalysis),
      type: 'analysis',
      confidence: riskAnalysis.confidence,
      metadata: {
        symbol: selectedMarkets[0],
        analysis: {
          riskLevel: riskAnalysis.riskLevel,
          marketSentiment: riskAnalysis.marketSentiment
        }
      }
    };
  }

  private async handleGeneralQuery(message: string, context: ChatContext): Promise<AIResponse> {
    // Handle general market-related questions
    const response = await this.generateGeneralResponse(message, context);
    
    return {
      message: response.message,
      type: 'general',
      confidence: response.confidence,
      metadata: response.metadata
    };
  }

  private combineAnalyses(technical: any, fundamental: any) {
    // Implement logic to combine technical and fundamental analyses
    return {
      ...technical,
      ...fundamental,
      confidence: (technical.confidence + fundamental.confidence) / 2
    };
  }

  private formatAnalysisResponse(analysis: any): string {
    return `Based on my analysis of ${analysis.symbol}:

Technical Analysis:
• Overall Score: ${analysis.technicalScore}/100
• Key Indicators: ${analysis.indicators.join(', ')}
• Trend Direction: ${analysis.trend}

Fundamental Analysis:
• Market Sentiment: ${analysis.marketSentiment}
• Risk Level: ${analysis.riskLevel}
• Key Factors: ${analysis.keyFactors.join(', ')}

Recommendation:
${analysis.recommendation}

Confidence Level: ${(analysis.confidence * 100).toFixed(1)}%`;
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

Supporting Indicators:
${signal.indicators.map((ind: any) => `• ${ind.name}: ${ind.value}`).join('\n')}

Confidence Level: ${(signal.confidence * 100).toFixed(1)}%`;
  }

  private formatPredictionResponse(prediction: any): string {
    return `Price Prediction for ${prediction.symbol}:

Forecast:
• Direction: ${prediction.direction}
• Target Price: ${prediction.price}
• Timeframe: ${prediction.timeframe}
• Probability: ${prediction.probability}%

Key Factors:
${prediction.factors.map((factor: string) => `• ${factor}`).join('\n')}

Note: This prediction is based on historical data and current market conditions.
Always practice proper risk management.`;
  }

  private formatRiskResponse(risk: any): string {
    return `Risk Assessment for ${risk.symbol}:

Risk Level: ${risk.riskLevel}
Market Volatility: ${risk.volatility}

Key Risk Factors:
${risk.factors.map((factor: string) => `• ${factor}`).join('\n')}

Recommended Risk Management:
• Position Size: ${risk.recommendedSize}
• Stop Loss: ${risk.recommendedStopLoss}
• Risk/Reward Ratio: ${risk.riskRewardRatio}`;
  }

  private async generateGeneralResponse(message: string, context: ChatContext): Promise<any> {
    // Implement general response logic
    return {
      message: "I understand you're asking about the markets. Could you please be more specific about what you'd like to know? I can help with:\n\n• Market analysis\n• Trading signals\n• Price predictions\n• Risk assessment",
      confidence: 0.7,
      metadata: {}
    };
  }

  private async analyzeSignalStrength(signals: any): Promise<any> {
    // Implement signal strength analysis
    return {
      ...signals,
      confidence: 0.85
    };
  }
}
