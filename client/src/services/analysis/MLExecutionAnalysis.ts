import { Order, MarketData } from '../brokers/types';
import { MarketState } from './HistoricalDataService';

interface Feature {
  volatility: number;
  trend: number;
  volumeProfile: number;
  spreadWidth: number;
  marketHours: number; // encoded market hours
  orderSize: number;
  orderType: number;  // encoded order type
  timeOfDay: number;
  dayOfWeek: number;
  priceLevel: number;
}

interface Prediction {
  expectedSlippage: number;
  expectedFillTime: number;
  expectedImpact: number;
  confidence: number;
}

interface ModelMetrics {
  mse: number;
  mae: number;
  r2: number;
}

export class MLExecutionAnalysis {
  private features: Feature[] = [];
  private labels: number[] = [];
  private model: any = null; // Would use TensorFlow.js in real implementation
  private modelMetrics: ModelMetrics = { mse: 0, mae: 0, r2: 0 };
  private readonly minSamples = 1000;
  private isTraining = false;

  async addTrainingData(
    order: Order,
    marketData: MarketData,
    marketState: MarketState,
    executionQuality: {
      slippage: number;
      fillTime: number;
      impact: number;
    }
  ): Promise<void> {
    const feature = this.extractFeatures(order, marketData, marketState);
    this.features.push(feature);
    this.labels.push(executionQuality.slippage);

    // Train model when we have enough data
    if (this.features.length >= this.minSamples && !this.isTraining) {
      await this.trainModel();
    }
  }

  async predictExecutionQuality(
    order: Order,
    marketData: MarketData,
    marketState: MarketState
  ): Promise<Prediction | null> {
    if (!this.model || this.features.length < this.minSamples) {
      return null;
    }

    const feature = this.extractFeatures(order, marketData, marketState);
    return await this.predict(feature);
  }

  async getOptimalExecutionStrategy(
    symbol: string,
    size: number,
    marketData: MarketData,
    marketState: MarketState
  ): Promise<{
    orderType: 'market' | 'limit' | 'iceberg';
    timing: 'immediate' | 'delayed';
    splits: number;
    expectedQuality: Prediction;
  }> {
    // Test different strategies
    const strategies = await this.evaluateStrategies(
      size,
      marketData,
      marketState
    );

    // Sort by expected quality (weighted sum of metrics)
    strategies.sort((a, b) => 
      this.calculateStrategyScore(a.expectedQuality) -
      this.calculateStrategyScore(b.expectedQuality)
    );

    return strategies[0];
  }

  getModelPerformance(): ModelMetrics {
    return this.modelMetrics;
  }

  private extractFeatures(
    order: Order,
    marketData: MarketData,
    marketState: MarketState
  ): Feature {
    const timestamp = new Date(marketData.timestamp);
    
    return {
      volatility: marketState.volatility,
      trend: marketState.trend,
      volumeProfile: marketState.volumeProfile,
      spreadWidth: marketState.spreadWidth,
      marketHours: this.encodeMarketHours(marketState.marketHours),
      orderSize: order.quantity,
      orderType: this.encodeOrderType(order.type),
      timeOfDay: timestamp.getUTCHours() + timestamp.getUTCMinutes() / 60,
      dayOfWeek: timestamp.getUTCDay(),
      priceLevel: order.price ? order.price / marketData.last : 1,
    };
  }

  private encodeMarketHours(hours: string): number {
    const mapping = { asia: 0, london: 1, ny: 2, off: 3 };
    return mapping[hours as keyof typeof mapping];
  }

  private encodeOrderType(type: string): number {
    const mapping = { market: 0, limit: 1, stop: 2, stopLimit: 3 };
    return mapping[type as keyof typeof mapping];
  }

  private async trainModel(): Promise<void> {
    this.isTraining = true;
    try {
      // In a real implementation, this would:
      // 1. Split data into training and validation sets
      // 2. Normalize features
      // 3. Train using TensorFlow.js
      // 4. Calculate metrics
      // 5. Save model state

      // Placeholder implementation
      this.modelMetrics = {
        mse: 0.0001,
        mae: 0.005,
        r2: 0.85,
      };
    } finally {
      this.isTraining = false;
    }
  }

  private async predict(feature: Feature): Promise<Prediction> {
    // In a real implementation, this would:
    // 1. Normalize features
    // 2. Run inference using TensorFlow.js
    // 3. Calculate confidence intervals

    // Placeholder implementation
    return {
      expectedSlippage: 0.0001,
      expectedFillTime: 100,
      expectedImpact: 0.0002,
      confidence: 0.85,
    };
  }

  private async evaluateStrategies(
    size: number,
    marketData: MarketData,
    marketState: MarketState
  ): Promise<Array<{
    orderType: 'market' | 'limit' | 'iceberg';
    timing: 'immediate' | 'delayed';
    splits: number;
    expectedQuality: Prediction;
  }>> {
    const strategies: Array<{
      orderType: 'market' | 'limit' | 'iceberg';
      timing: 'immediate' | 'delayed';
      splits: number;
      expectedQuality: Prediction;
    }> = [];

    // Test different combinations
    const orderTypes: Array<'market' | 'limit' | 'iceberg'> = ['market', 'limit', 'iceberg'];
    const timings: Array<'immediate' | 'delayed'> = ['immediate', 'delayed'];
    const splitOptions = [1, 2, 4, 8];

    for (const orderType of orderTypes) {
      for (const timing of timings) {
        for (const splits of splitOptions) {
          const splitSize = size / splits;
          
          // Create mock order for prediction
          const mockOrder: Order = {
            symbol: marketData.symbol,
            quantity: splitSize,
            type: orderType === 'iceberg' ? 'limit' : orderType,
            side: 'buy',
            timeInForce: 'gtc',
          };

          const prediction = await this.predictExecutionQuality(
            mockOrder,
            marketData,
            marketState
          );

          if (prediction) {
            // Adjust prediction for splits
            const adjustedPrediction = this.adjustPredictionForSplits(
              prediction,
              splits,
              timing
            );

            strategies.push({
              orderType,
              timing,
              splits,
              expectedQuality: adjustedPrediction,
            });
          }
        }
      }
    }

    return strategies;
  }

  private adjustPredictionForSplits(
    prediction: Prediction,
    splits: number,
    timing: 'immediate' | 'delayed'
  ): Prediction {
    // Adjust predictions based on splits and timing
    const splitFactor = Math.sqrt(splits);
    const timingFactor = timing === 'delayed' ? 1.2 : 1;

    return {
      expectedSlippage: prediction.expectedSlippage / splitFactor,
      expectedFillTime: prediction.expectedFillTime * splitFactor * timingFactor,
      expectedImpact: prediction.expectedImpact / splitFactor,
      confidence: prediction.confidence * (1 / Math.log2(splits + 1)),
    };
  }

  private calculateStrategyScore(quality: Prediction): number {
    // Lower is better
    return (
      quality.expectedSlippage * 10000 +  // Convert to basis points
      quality.expectedFillTime * 0.0001 + // Small penalty for longer fills
      quality.expectedImpact * 10000 -    // Convert to basis points
      quality.confidence                  // Higher confidence is better
    );
  }

  async analyzeLearningProgress(): Promise<{
    learningCurve: number[];
    featureImportance: { [key: string]: number };
    predictionBias: number;
    crossValidationScores: number[];
  }> {
    // In a real implementation, this would:
    // 1. Calculate learning curves
    // 2. Perform feature importance analysis
    // 3. Check for prediction bias
    // 4. Run cross-validation

    return {
      learningCurve: [0.1, 0.05, 0.02, 0.01, 0.005],
      featureImportance: {
        volatility: 0.3,
        trend: 0.15,
        volumeProfile: 0.2,
        spreadWidth: 0.1,
        marketHours: 0.05,
        orderSize: 0.1,
        orderType: 0.05,
        timeOfDay: 0.03,
        dayOfWeek: 0.01,
        priceLevel: 0.01,
      },
      predictionBias: 0.001,
      crossValidationScores: [0.82, 0.84, 0.86, 0.83, 0.85],
    };
  }

  async generateReport(): Promise<{
    modelPerformance: ModelMetrics;
    featureImportance: { [key: string]: number };
    recommendations: string[];
    warnings: string[];
  }> {
    const analysis = await this.analyzeLearningProgress();

    return {
      modelPerformance: this.modelMetrics,
      featureImportance: analysis.featureImportance,
      recommendations: [
        'Consider splitting large orders during high volatility',
        'Prefer limit orders during trending markets',
        'Avoid trading during low liquidity periods',
      ],
      warnings: [
        analysis.predictionBias > 0.005 ? 'High prediction bias detected' : '',
        this.features.length < this.minSamples * 2 ? 'More training data needed' : '',
      ].filter(Boolean),
    };
  }
}
