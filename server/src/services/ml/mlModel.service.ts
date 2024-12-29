import { logger } from '../../utils/logger';
import * as tf from '@tensorflow/tfjs-node';
import { MarketDataService } from '../marketData.service';

export class MLModelService {
  private model: tf.LayersModel | null = null;
  private marketDataService: MarketDataService;
  private isModelLoaded: boolean = false;

  constructor() {
    this.marketDataService = new MarketDataService();
  }

  async initialize() {
    try {
      // Load pre-trained model
      this.model = await tf.loadLayersModel('file://./models/market_prediction_model/model.json');
      this.isModelLoaded = true;
      logger.info('ML model loaded successfully');
    } catch (error) {
      logger.error('Error loading ML model:', error);
      throw new Error('Failed to load ML model');
    }
  }

  async predictPriceMovement(symbol: string, timeframe: string): Promise<{
    direction: 'up' | 'down' | 'sideways';
    probability: number;
    nextPrice: number;
  }> {
    try {
      if (!this.isModelLoaded) {
        await this.initialize();
      }

      // Get historical data
      const marketData = await this.marketDataService.getMarketData([symbol], timeframe);
      
      // Prepare data for prediction
      const processedData = this.preprocessData(marketData[symbol]);
      
      // Make prediction
      const prediction = await this.model!.predict(processedData) as tf.Tensor;
      const [direction, probability, nextPrice] = this.interpretPrediction(prediction);

      return {
        direction,
        probability,
        nextPrice
      };
    } catch (error) {
      logger.error('Error making price prediction:', error);
      throw error;
    }
  }

  private preprocessData(marketData: any): tf.Tensor {
    try {
      // Extract features (example features - customize based on your model)
      const features = marketData.map((data: any) => [
        data.close,
        data.volume,
        data.rsi,
        data.macd,
        data.bollinger
      ]);

      // Normalize data
      const normalizedFeatures = this.normalizeData(features);

      // Convert to tensor
      return tf.tensor2d(normalizedFeatures);
    } catch (error) {
      logger.error('Error preprocessing data:', error);
      throw error;
    }
  }

  private normalizeData(data: number[][]): number[][] {
    // Implement min-max normalization
    const numFeatures = data[0].length;
    const normalizedData = [...data];

    for (let i = 0; i < numFeatures; i++) {
      const column = data.map(row => row[i]);
      const min = Math.min(...column);
      const max = Math.max(...column);
      const range = max - min;

      for (let j = 0; j < data.length; j++) {
        normalizedData[j][i] = range !== 0 ? 
          (data[j][i] - min) / range : 
          0;
      }
    }

    return normalizedData;
  }

  private interpretPrediction(prediction: tf.Tensor): ['up' | 'down' | 'sideways', number, number] {
    const predictionData = prediction.dataSync();
    
    // Example interpretation - adjust based on your model's output
    const directionProb = predictionData[0];
    const predictedPrice = predictionData[1];
    
    let direction: 'up' | 'down' | 'sideways';
    if (directionProb > 0.6) {
      direction = 'up';
    } else if (directionProb < 0.4) {
      direction = 'down';
    } else {
      direction = 'sideways';
    }

    const probability = Math.abs(directionProb - 0.5) * 2;

    return [direction, probability, predictedPrice];
  }

  public async trainModel(trainingData: any) {
    try {
      if (!this.model) {
        this.model = this.createModel();
      }

      const processedData = this.preprocessData(trainingData);
      const labels = this.prepareLabels(trainingData);

      await this.model.fit(processedData, labels, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            logger.info(`Epoch ${epoch}: loss = ${logs?.loss}`);
          }
        }
      });

      // Save the trained model
      await this.model.save('file://./models/market_prediction_model');
      logger.info('Model training completed and saved');
    } catch (error) {
      logger.error('Error training model:', error);
      throw error;
    }
  }

  private createModel(): tf.LayersModel {
    const model = tf.sequential();
    
    // Input layer
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [5] // Adjust based on your features
    }));

    // Hidden layers
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    // Output layer
    model.add(tf.layers.dense({
      units: 2, // Direction probability and price prediction
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    return model;
  }

  private prepareLabels(data: any): tf.Tensor {
    // Prepare labels for training (example implementation)
    const labels = data.map((item: any) => [
      item.nextPriceDirection === 'up' ? 1 : 0,
      item.normalizedNextPrice
    ]);

    return tf.tensor2d(labels);
  }
}
