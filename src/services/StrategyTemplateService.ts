import { StrategyConfig } from './AlgoTradingService';

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'TREND' | 'MEAN_REVERSION' | 'SCALPING' | 'ARBITRAGE' | 'MOMENTUM';
  config: StrategyConfig;
  performance?: {
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    monthlyReturn: number;
  };
  author: string;
  rating: number;
  downloads: number;
  price: number;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

class StrategyTemplateService {
  private static instance: StrategyTemplateService;
  private templates: Map<string, StrategyTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  static getInstance(): StrategyTemplateService {
    if (!StrategyTemplateService.instance) {
      StrategyTemplateService.instance = new StrategyTemplateService();
    }
    return StrategyTemplateService.instance;
  }

  private initializeTemplates() {
    const defaultTemplates: StrategyTemplate[] = [
      {
        id: 'trend-following-ema',
        name: 'Trend Following EMA Crossover',
        description: 'A classic trend following strategy using EMA crossovers for entry and exit signals.',
        category: 'TREND',
        config: {
          symbol: 'EURUSD',
          entryConditions: [
            {
              indicator: 'EMA',
              operator: 'CROSSES_ABOVE',
              value: 20,
            },
          ],
          exitConditions: [
            {
              indicator: 'EMA',
              operator: 'CROSSES_BELOW',
              value: 50,
            },
          ],
          riskManagement: {
            maxPositionSize: 1000,
            stopLoss: 1,
            takeProfit: 2,
            trailingStop: 0.5,
          },
        },
        performance: {
          winRate: 62.5,
          sharpeRatio: 1.8,
          maxDrawdown: 15,
          monthlyReturn: 3.2,
        },
        author: 'Algo360FX',
        rating: 4.5,
        downloads: 1250,
        price: 0,
        tags: ['trend', 'ema', 'crossover', 'beginner-friendly'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'scalping-rsi',
        name: 'RSI Scalping Strategy',
        description: 'High-frequency scalping strategy using RSI for overbought/oversold conditions.',
        category: 'SCALPING',
        config: {
          symbol: 'EURUSD',
          entryConditions: [
            {
              indicator: 'RSI',
              operator: 'LESS_THAN',
              value: 30,
            },
          ],
          exitConditions: [
            {
              indicator: 'RSI',
              operator: 'GREATER_THAN',
              value: 70,
            },
          ],
          riskManagement: {
            maxPositionSize: 500,
            stopLoss: 0.5,
            takeProfit: 1,
            trailingStop: 0.2,
          },
        },
        performance: {
          winRate: 68.3,
          sharpeRatio: 2.1,
          maxDrawdown: 8,
          monthlyReturn: 4.5,
        },
        author: 'Algo360FX',
        rating: 4.8,
        downloads: 2100,
        price: 0,
        tags: ['scalping', 'rsi', 'high-frequency', 'intraday'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'mean-reversion-bb',
        name: 'Bollinger Bands Mean Reversion',
        description: 'Mean reversion strategy using Bollinger Bands for identifying price extremes.',
        category: 'MEAN_REVERSION',
        config: {
          symbol: 'EURUSD',
          entryConditions: [
            {
              indicator: 'BOLLINGER_BANDS',
              operator: 'LESS_THAN',
              value: -2,
            },
          ],
          exitConditions: [
            {
              indicator: 'BOLLINGER_BANDS',
              operator: 'GREATER_THAN',
              value: 0,
            },
          ],
          riskManagement: {
            maxPositionSize: 1000,
            stopLoss: 1,
            takeProfit: 1.5,
            trailingStop: 0.3,
          },
        },
        performance: {
          winRate: 65.7,
          sharpeRatio: 1.9,
          maxDrawdown: 12,
          monthlyReturn: 3.8,
        },
        author: 'Algo360FX',
        rating: 4.3,
        downloads: 1800,
        price: 0,
        tags: ['mean-reversion', 'bollinger-bands', 'swing-trading'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  getTemplates(): StrategyTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplateById(id: string): StrategyTemplate | undefined {
    return this.templates.get(id);
  }

  getTemplatesByCategory(category: StrategyTemplate['category']): StrategyTemplate[] {
    return this.getTemplates().filter(template => template.category === category);
  }

  searchTemplates(query: string): StrategyTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getTemplates().filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  addTemplate(template: Omit<StrategyTemplate, 'id' | 'createdAt' | 'updatedAt'>): StrategyTemplate {
    const id = `template-${Date.now()}`;
    const newTemplate: StrategyTemplate = {
      ...template,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  updateTemplate(id: string, updates: Partial<StrategyTemplate>): StrategyTemplate | undefined {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: Date.now(),
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }
}

export default StrategyTemplateService;
