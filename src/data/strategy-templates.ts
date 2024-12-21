import {
  StrategyType,
  IndicatorType,
  TradingStrategy,
} from '@/types/algo-trading';

export const strategyTemplates: Partial<TradingStrategy>[] = [
  {
    name: 'Moving Average Crossover',
    type: StrategyType.TREND_FOLLOWING,
    description:
      'A classic trend-following strategy that generates signals when a faster moving average crosses a slower moving average.',
    timeframe: '1h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.SMA,
            params: { period: 20 },
          },
          operator: 'CROSSES_ABOVE',
          indicator2: {
            type: IndicatorType.SMA,
            params: { period: 50 },
          },
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.SMA,
            params: { period: 20 },
          },
          operator: 'CROSSES_BELOW',
          indicator2: {
            type: IndicatorType.SMA,
            params: { period: 50 },
          },
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2,
      takeProfit: 4,
      trailingStop: 1.5,
    },
  },
  {
    name: 'RSI Mean Reversion',
    type: StrategyType.MEAN_REVERSION,
    description:
      'A mean reversion strategy that buys oversold conditions and sells overbought conditions using the RSI indicator.',
    timeframe: '15m',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.RSI,
            params: { period: 14 },
          },
          operator: 'LESS_THAN',
          value: 30,
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.RSI,
            params: { period: 14 },
          },
          operator: 'GREATER_THAN',
          value: 70,
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 1.5,
      takeProfit: 3,
    },
  },
  {
    name: 'Bollinger Band Breakout',
    type: StrategyType.BREAKOUT,
    description:
      'A breakout strategy that generates signals when price breaks out of the Bollinger Bands, indicating potential trend continuation.',
    timeframe: '1h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.BOLLINGER_BANDS,
            params: { period: 20, standardDeviations: 2 },
          },
          operator: 'GREATER_THAN',
          value: 1, // Upper band
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.BOLLINGER_BANDS,
            params: { period: 20, standardDeviations: 2 },
          },
          operator: 'LESS_THAN',
          value: 0, // Middle band
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2,
      takeProfit: 4,
      trailingStop: 1,
    },
  },
  {
    name: 'MACD Momentum',
    type: StrategyType.MOMENTUM,
    description:
      'A momentum strategy that uses MACD crossovers to identify potential trend changes and momentum shifts.',
    timeframe: '4h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.MACD,
            params: {
              fastPeriod: 12,
              slowPeriod: 26,
              signalPeriod: 9,
            },
          },
          operator: 'CROSSES_ABOVE',
          value: 0,
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.MACD,
            params: {
              fastPeriod: 12,
              slowPeriod: 26,
              signalPeriod: 9,
            },
          },
          operator: 'CROSSES_BELOW',
          value: 0,
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2.5,
      takeProfit: 5,
      trailingStop: 2,
    },
  },
  {
    name: 'Multi-Timeframe Momentum',
    type: StrategyType.MOMENTUM,
    description:
      'A sophisticated momentum strategy that combines multiple timeframes to confirm trend direction and momentum.',
    timeframe: '1h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.EMA,
            params: { period: 20 },
          },
          operator: 'GREATER_THAN',
          indicator2: {
            type: IndicatorType.EMA,
            params: { period: 50 },
          },
        },
        {
          indicator1: {
            type: IndicatorType.RSI,
            params: { period: 14 },
          },
          operator: 'GREATER_THAN',
          value: 50,
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.EMA,
            params: { period: 20 },
          },
          operator: 'LESS_THAN',
          indicator2: {
            type: IndicatorType.EMA,
            params: { period: 50 },
          },
        },
        {
          indicator1: {
            type: IndicatorType.RSI,
            params: { period: 14 },
          },
          operator: 'LESS_THAN',
          value: 50,
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2,
      takeProfit: 4,
      trailingStop: 1.5,
      maxDrawdown: 10,
    },
  },
  {
    name: 'Volatility Breakout',
    type: StrategyType.BREAKOUT,
    description:
      'A breakout strategy that uses ATR to measure volatility and generate signals when price breaks significant levels.',
    timeframe: '1h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.ATR,
            params: { period: 14 },
          },
          operator: 'GREATER_THAN',
          value: 1.5,
        },
        {
          indicator1: {
            type: IndicatorType.BOLLINGER_BANDS,
            params: { period: 20, standardDeviations: 2 },
          },
          operator: 'GREATER_THAN',
          value: 1,
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.ATR,
            params: { period: 14 },
          },
          operator: 'LESS_THAN',
          value: 1,
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 3,
      takeProfit: 6,
      trailingStop: 2,
      maxDrawdown: 15,
    },
  },
  {
    name: 'Volume Price Confirmation',
    type: StrategyType.MOMENTUM,
    description:
      'A sophisticated strategy that combines price action with volume indicators to confirm trend strength and potential reversals.',
    timeframe: '1h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.EMA,
            params: { period: 20 },
          },
          operator: 'GREATER_THAN',
          indicator2: {
            type: IndicatorType.EMA,
            params: { period: 50 },
          },
        },
        {
          indicator1: {
            type: IndicatorType.CMF,
            params: { period: 20 },
          },
          operator: 'GREATER_THAN',
          value: 0.2,
        },
        {
          indicator1: {
            type: IndicatorType.FORCE_INDEX,
            params: { period: 13 },
          },
          operator: 'GREATER_THAN',
          value: 0,
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.CMF,
            params: { period: 20 },
          },
          operator: 'LESS_THAN',
          value: -0.1,
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2,
      takeProfit: 4,
      trailingStop: 1.5,
      maxDrawdown: 10,
    },
  },
  {
    name: 'Advanced Volatility Breakout',
    type: StrategyType.BREAKOUT,
    description:
      'Uses multiple volatility indicators to identify and trade high-probability breakouts while managing risk.',
    timeframe: '4h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.KELTNER_CHANNELS,
            params: { 
              emaPeriod: 20,
              atrPeriod: 10,
              multiplier: 2,
            },
          },
          operator: 'GREATER_THAN',
          value: 1,
        },
        {
          indicator1: {
            type: IndicatorType.HISTORICAL_VOLATILITY,
            params: { 
              period: 20,
              annualizationFactor: 252,
            },
          },
          operator: 'GREATER_THAN',
          value: 20,
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.KELTNER_CHANNELS,
            params: {
              emaPeriod: 20,
              atrPeriod: 10,
              multiplier: 2,
            },
          },
          operator: 'LESS_THAN',
          value: 0,
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2.5,
      takeProfit: 5,
      trailingStop: 2,
      maxDrawdown: 15,
    },
  },
  {
    name: 'Smart Momentum RSI',
    type: StrategyType.MOMENTUM,
    description:
      'Combines RMI and CMO for more accurate momentum signals while filtering out false signals in ranging markets.',
    timeframe: '1h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.RMI,
            params: { 
              period: 14,
              momentum: 3,
            },
          },
          operator: 'GREATER_THAN',
          value: 60,
        },
        {
          indicator1: {
            type: IndicatorType.CMO,
            params: { period: 14 },
          },
          operator: 'GREATER_THAN',
          value: 30,
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.RMI,
            params: {
              period: 14,
              momentum: 3,
            },
          },
          operator: 'LESS_THAN',
          value: 40,
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 2,
      takeProfit: 4,
      trailingStop: 1.5,
      maxDrawdown: 12,
    },
  },
  {
    name: 'Ultimate Trend Momentum',
    type: StrategyType.TREND_FOLLOWING,
    description:
      'Utilizes the Ultimate Oscillator combined with SMI for high-probability trend continuation trades.',
    timeframe: '4h',
    conditions: {
      entry: [
        {
          indicator1: {
            type: IndicatorType.UO,
            params: {
              period1: 7,
              period2: 14,
              period3: 28,
              weight1: 4,
              weight2: 2,
              weight3: 1,
            },
          },
          operator: 'GREATER_THAN',
          value: 60,
        },
        {
          indicator1: {
            type: IndicatorType.SMI,
            params: {
              period: 13,
              smoothK: 25,
              smoothD: 2,
            },
          },
          operator: 'GREATER_THAN',
          value: 40,
        },
      ],
      exit: [
        {
          indicator1: {
            type: IndicatorType.UO,
            params: {
              period1: 7,
              period2: 14,
              period3: 28,
              weight1: 4,
              weight2: 2,
              weight3: 1,
            },
          },
          operator: 'LESS_THAN',
          value: 40,
        },
      ],
    },
    riskManagement: {
      maxPositionSize: 1000,
      stopLoss: 3,
      takeProfit: 6,
      trailingStop: 2,
      maxDrawdown: 15,
    },
  },
];

export const getTemplateByType = (type: StrategyType) =>
  strategyTemplates.filter((template) => template.type === type);

export const getTemplateByName = (name: string) =>
  strategyTemplates.find((template) => template.name === name);
