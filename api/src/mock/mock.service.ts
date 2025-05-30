import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  // Mock market data
  getMarketData() {
    return {
      forex: this.generateForexData(),
      stocks: this.generateStockData(),
      crypto: this.generateCryptoData(),
      indices: this.generateIndicesData(),
    };
  }

  // Mock trading strategies
  getTradingStrategies() {
    return [
      {
        id: '1',
        name: 'Trend Following',
        description: 'A strategy that follows market trends to generate buy and sell signals',
        performance: {
          winRate: 68,
          profitFactor: 1.8,
          sharpeRatio: 1.4,
          maxDrawdown: 12.5,
        },
        markets: ['forex', 'stocks', 'indices'],
        timeframes: ['1h', '4h', 'daily'],
      },
      {
        id: '2',
        name: 'Mean Reversion',
        description: 'A strategy that capitalizes on market overreactions and price reversals',
        performance: {
          winRate: 72,
          profitFactor: 1.6,
          sharpeRatio: 1.2,
          maxDrawdown: 15.8,
        },
        markets: ['forex', 'stocks'],
        timeframes: ['15m', '1h', '4h'],
      },
      {
        id: '3',
        name: 'Breakout Trading',
        description: 'A strategy that identifies and trades price breakouts from key levels',
        performance: {
          winRate: 58,
          profitFactor: 2.1,
          sharpeRatio: 1.6,
          maxDrawdown: 18.2,
        },
        markets: ['forex', 'crypto', 'indices'],
        timeframes: ['1h', '4h', 'daily'],
      },
      {
        id: '4',
        name: 'Algorithmic Scalping',
        description: 'A high-frequency strategy that takes advantage of small price movements',
        performance: {
          winRate: 65,
          profitFactor: 1.4,
          sharpeRatio: 1.1,
          maxDrawdown: 8.7,
        },
        markets: ['forex', 'crypto'],
        timeframes: ['1m', '5m', '15m'],
      },
      {
        id: '5',
        name: 'Multi-Factor Model',
        description: 'A comprehensive strategy that combines multiple technical and fundamental factors',
        performance: {
          winRate: 75,
          profitFactor: 2.3,
          sharpeRatio: 1.8,
          maxDrawdown: 14.3,
        },
        markets: ['stocks', 'indices'],
        timeframes: ['4h', 'daily', 'weekly'],
      },
    ];
  }

  // Mock subscription plans
  getSubscriptionPlans() {
    return [
      {
        id: 'basic',
        name: 'Basic Plan',
        price: 29.99,
        billingCycle: 'monthly',
        features: [
          'Real-time market data',
          'Basic technical analysis tools',
          'Trading journal',
          'Community access',
        ],
        recommended: false,
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        price: 79.99,
        billingCycle: 'monthly',
        features: [
          'All Basic Plan features',
          'Advanced technical indicators',
          'Strategy backtesting',
          'Trading signals',
          'Portfolio analysis',
        ],
        recommended: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 199.99,
        billingCycle: 'monthly',
        features: [
          'All Pro Plan features',
          'AI-powered market analysis',
          'Custom strategy development',
          'API access',
          'Dedicated support',
          'Unlimited backtesting',
        ],
        recommended: false,
      },
      {
        id: 'basic-annual',
        name: 'Basic Plan (Annual)',
        price: 299.99,
        billingCycle: 'annual',
        features: [
          'Real-time market data',
          'Basic technical analysis tools',
          'Trading journal',
          'Community access',
        ],
        discount: '16%',
        recommended: false,
      },
      {
        id: 'pro-annual',
        name: 'Pro Plan (Annual)',
        price: 799.99,
        billingCycle: 'annual',
        features: [
          'All Basic Plan features',
          'Advanced technical indicators',
          'Strategy backtesting',
          'Trading signals',
          'Portfolio analysis',
        ],
        discount: '16%',
        recommended: false,
      },
      {
        id: 'enterprise-annual',
        name: 'Enterprise Plan (Annual)',
        price: 1999.99,
        billingCycle: 'annual',
        features: [
          'All Pro Plan features',
          'AI-powered market analysis',
          'Custom strategy development',
          'API access',
          'Dedicated support',
          'Unlimited backtesting',
        ],
        discount: '16%',
        recommended: false,
      },
    ];
  }

  // Mock marketplace items (ebooks, courses, etc.)
  getMarketplaceItems() {
    return {
      ebooks: [
        {
          id: 'eb1',
          title: 'Mastering Technical Analysis',
          author: 'John Smith',
          description: 'A comprehensive guide to technical analysis for modern traders',
          price: 49.99,
          originalPrice: 69.99,
          discount: '28%',
          rating: 4.8,
          reviews: 124,
          coverImage: 'technical_analysis_cover.jpg',
          format: 'PDF',
          pages: 320,
          bestseller: true,
          featured: true,
        },
        {
          id: 'eb2',
          title: 'Algorithmic Trading Fundamentals',
          author: 'Sarah Johnson',
          description: 'Learn the basics of algorithmic trading and strategy development',
          price: 39.99,
          rating: 4.6,
          reviews: 87,
          coverImage: 'algo_trading_cover.jpg',
          format: 'PDF',
          pages: 280,
          bestseller: false,
          featured: true,
        },
        {
          id: 'eb3',
          title: 'Risk Management for Traders',
          author: 'Michael Brown',
          description: 'Essential risk management techniques for consistent profitability',
          price: 34.99,
          originalPrice: 44.99,
          discount: '22%',
          rating: 4.7,
          reviews: 56,
          coverImage: 'risk_management_cover.jpg',
          format: 'PDF',
          pages: 210,
          bestseller: true,
          featured: false,
        },
        {
          id: 'eb4',
          title: 'Psychology of Trading',
          author: 'Emily Chen',
          description: 'Master the mental aspects of trading for improved performance',
          price: 29.99,
          rating: 4.9,
          reviews: 142,
          coverImage: 'trading_psychology_cover.jpg',
          format: 'PDF',
          pages: 240,
          bestseller: true,
          featured: false,
        },
        {
          id: 'eb5',
          title: 'Forex Trading Strategies',
          author: 'David Wilson',
          description: 'Proven forex trading strategies for consistent profits',
          price: 44.99,
          rating: 4.5,
          reviews: 78,
          coverImage: 'forex_strategies_cover.jpg',
          format: 'PDF',
          pages: 290,
          bestseller: false,
          featured: true,
        },
      ],
      courses: [
        {
          id: 'c1',
          title: 'Advanced Trading Masterclass',
          instructor: 'Robert Johnson',
          description: 'A comprehensive course covering advanced trading techniques',
          price: 199.99,
          originalPrice: 299.99,
          discount: '33%',
          rating: 4.9,
          reviews: 215,
          coverImage: 'advanced_trading_cover.jpg',
          duration: '12 weeks',
          level: 'Advanced',
          bestseller: true,
          featured: true,
        },
        {
          id: 'c2',
          title: 'Algorithmic Trading with Python',
          instructor: 'Jennifer Lee',
          description: 'Learn to build and deploy trading algorithms using Python',
          price: 149.99,
          rating: 4.7,
          reviews: 168,
          coverImage: 'algo_python_cover.jpg',
          duration: '8 weeks',
          level: 'Intermediate',
          bestseller: true,
          featured: true,
        },
        {
          id: 'c3',
          title: 'Technical Analysis Fundamentals',
          instructor: 'Mark Williams',
          description: 'Master the basics of technical analysis for any market',
          price: 99.99,
          originalPrice: 129.99,
          discount: '23%',
          rating: 4.6,
          reviews: 132,
          coverImage: 'ta_fundamentals_cover.jpg',
          duration: '6 weeks',
          level: 'Beginner',
          bestseller: false,
          featured: true,
        },
      ],
    };
  }

  // Helper methods to generate mock data
  private generateForexData() {
    return [
      {
        pair: 'EUR/USD',
        bid: 1.0921,
        ask: 1.0923,
        change: 0.0012,
        changePercent: 0.11,
        high: 1.0945,
        low: 1.0897,
        volume: 98432,
      },
      {
        pair: 'GBP/USD',
        bid: 1.2654,
        ask: 1.2657,
        change: -0.0032,
        changePercent: -0.25,
        high: 1.2698,
        low: 1.2642,
        volume: 76543,
      },
      {
        pair: 'USD/JPY',
        bid: 109.21,
        ask: 109.24,
        change: 0.42,
        changePercent: 0.39,
        high: 109.56,
        low: 108.92,
        volume: 87654,
      },
      {
        pair: 'AUD/USD',
        bid: 0.7123,
        ask: 0.7125,
        change: -0.0018,
        changePercent: -0.25,
        high: 0.7156,
        low: 0.7115,
        volume: 54321,
      },
      {
        pair: 'USD/CAD',
        bid: 1.3245,
        ask: 1.3248,
        change: 0.0023,
        changePercent: 0.17,
        high: 1.3267,
        low: 1.3221,
        volume: 43215,
      },
    ];
  }

  private generateStockData() {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 172.45,
        change: 2.34,
        changePercent: 1.38,
        volume: 68432156,
        marketCap: '2.85T',
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 342.89,
        change: -1.23,
        changePercent: -0.36,
        volume: 23456789,
        marketCap: '2.56T',
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 131.78,
        change: 0.87,
        changePercent: 0.67,
        volume: 18765432,
        marketCap: '1.67T',
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 178.32,
        change: -2.45,
        changePercent: -1.36,
        volume: 32145678,
        marketCap: '1.84T',
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        price: 245.67,
        change: 12.43,
        changePercent: 5.32,
        volume: 87654321,
        marketCap: '780.45B',
      },
    ];
  }

  private generateCryptoData() {
    return [
      {
        symbol: 'BTC/USD',
        name: 'Bitcoin',
        price: 43256.78,
        change: 1243.45,
        changePercent: 2.96,
        volume: 28765432123,
        marketCap: '845.32B',
      },
      {
        symbol: 'ETH/USD',
        name: 'Ethereum',
        price: 2345.67,
        change: -78.34,
        changePercent: -3.23,
        volume: 15432678901,
        marketCap: '281.45B',
      },
      {
        symbol: 'XRP/USD',
        name: 'Ripple',
        price: 0.5432,
        change: 0.0234,
        changePercent: 4.51,
        volume: 3456789012,
        marketCap: '28.67B',
      },
      {
        symbol: 'SOL/USD',
        name: 'Solana',
        price: 123.45,
        change: 5.67,
        changePercent: 4.82,
        volume: 5678901234,
        marketCap: '52.34B',
      },
      {
        symbol: 'ADA/USD',
        name: 'Cardano',
        price: 0.4321,
        change: -0.0123,
        changePercent: -2.77,
        volume: 2345678901,
        marketCap: '15.23B',
      },
    ];
  }

  private generateIndicesData() {
    return [
      {
        symbol: 'SPX',
        name: 'S&P 500',
        price: 4567.89,
        change: 23.45,
        changePercent: 0.52,
        volume: 2345678901,
      },
      {
        symbol: 'DJI',
        name: 'Dow Jones Industrial Average',
        price: 34567.89,
        change: -123.45,
        changePercent: -0.36,
        volume: 1234567890,
      },
      {
        symbol: 'IXIC',
        name: 'NASDAQ Composite',
        price: 14567.89,
        change: 78.45,
        changePercent: 0.54,
        volume: 3456789012,
      },
      {
        symbol: 'RUT',
        name: 'Russell 2000',
        price: 2345.67,
        change: -12.34,
        changePercent: -0.52,
        volume: 987654321,
      },
      {
        symbol: 'VIX',
        name: 'CBOE Volatility Index',
        price: 18.76,
        change: -0.87,
        changePercent: -4.43,
        volume: 456789012,
      },
    ];
  }
}
