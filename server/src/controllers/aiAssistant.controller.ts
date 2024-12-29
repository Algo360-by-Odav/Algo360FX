import { Request, Response, NextFunction } from 'express';
import { AIAssistantService } from '../services/aiAssistant.service';
import { MLModelService } from '../services/ml/mlModel.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class AIAssistantController {
  private aiAssistantService: AIAssistantService;
  private mlModelService: MLModelService;

  constructor() {
    this.aiAssistantService = new AIAssistantService();
    this.mlModelService = new MLModelService();
  }

  public processChat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { message, selectedMarkets, timeframe } = req.body;
    const user = req.user;

    if (!message || !selectedMarkets || !timeframe) {
      throw new AppError(400, 'Missing required parameters', 'AIAssistant');
    }

    const context = {
      previousMessages: [],
      user,
      selectedMarkets,
      timeframe
    };

    const response = await this.aiAssistantService.processChat(message, context);
    res.json(response);
  });

  public getPrediction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { symbol, timeframe } = req.query;

    if (!symbol || !timeframe) {
      throw new AppError(400, 'Symbol and timeframe are required', 'AIAssistant');
    }

    // Get ML model prediction
    const mlPrediction = await this.mlModelService.predictPriceMovement(
      symbol as string,
      timeframe as string
    );

    // Get AI analysis
    const aiContext = {
      previousMessages: [],
      user: req.user,
      selectedMarkets: [symbol as string],
      timeframe: timeframe as string
    };

    const aiAnalysis = await this.aiAssistantService.processChat(
      'Analyze current market conditions and provide prediction',
      aiContext
    );

    // Combine ML and AI insights
    const combinedPrediction = {
      symbol,
      timeframe,
      mlPrediction: {
        direction: mlPrediction.direction,
        probability: mlPrediction.probability,
        nextPrice: mlPrediction.nextPrice
      },
      aiAnalysis: {
        sentiment: aiAnalysis.metadata?.sentiment,
        analysis: aiAnalysis.metadata?.analysis,
        confidence: aiAnalysis.confidence
      },
      timestamp: new Date(),
      combinedConfidence: (mlPrediction.probability + (aiAnalysis.confidence || 0)) / 2
    };

    res.json(combinedPrediction);
  });

  public getMarketAnalysis = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { symbols, timeframe } = req.query;

    if (!symbols || !timeframe) {
      throw new AppError(400, 'Symbols and timeframe are required', 'AIAssistant');
    }

    const symbolsList = (symbols as string).split(',');

    const context = {
      previousMessages: [],
      user: req.user,
      selectedMarkets: symbolsList,
      timeframe: timeframe as string
    };

    const analysis = await this.aiAssistantService.processChat(
      'Provide detailed market analysis',
      context
    );

    res.json(analysis);
  });

  public getTradingSignals = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { symbol, timeframe } = req.query;

    if (!symbol || !timeframe) {
      throw new AppError(400, 'Symbol and timeframe are required', 'AIAssistant');
    }

    const context = {
      previousMessages: [],
      user: req.user,
      selectedMarkets: [symbol as string],
      timeframe: timeframe as string
    };

    const signals = await this.aiAssistantService.processChat(
      'Generate trading signals',
      context
    );

    res.json(signals);
  });

  public getRiskAssessment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { symbol } = req.query;

    if (!symbol) {
      throw new AppError(400, 'Symbol is required', 'AIAssistant');
    }

    const context = {
      previousMessages: [],
      user: req.user,
      selectedMarkets: [symbol as string],
      timeframe: '1h'
    };

    const assessment = await this.aiAssistantService.processChat(
      'Provide risk assessment',
      context
    );

    res.json(assessment);
  });
}
