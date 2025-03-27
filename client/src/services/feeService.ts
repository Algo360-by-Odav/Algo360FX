import { stockService } from './stockService';

export interface FeeStructure {
  tradingFees: {
    percentage: number;
    minAmount: number;
    maxAmount: number;
  };
  subscriptionFees: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  additionalFees: {
    inactivityFee: number;
    withdrawalFee: number;
    depositFee: number;
  };
}

export interface MarketFees {
  commission: number;
  spread: number;
  exchangeFee: number;
  clearingFee: number;
  regulatoryFee: number;
}

class FeeService {
  private static instance: FeeService;

  // Base fee structure
  private readonly baseFeeStructure: FeeStructure = {
    tradingFees: {
      percentage: 0.1, // 0.1% per trade
      minAmount: 1,    // Minimum $1
      maxAmount: 100   // Maximum $100
    },
    subscriptionFees: {
      monthly: 29.99,
      quarterly: 79.99,
      yearly: 299.99
    },
    additionalFees: {
      inactivityFee: 10,    // $10 per month if no trading activity
      withdrawalFee: 25,    // $25 per withdrawal
      depositFee: 0         // Free deposits
    }
  };

  // Market-specific fees
  private readonly marketFees: { [market: string]: MarketFees } = {
    US: {
      commission: 0.1,    // 0.1%
      spread: 0.01,       // 1 pip
      exchangeFee: 0.02,  // 0.02%
      clearingFee: 0.01,  // 0.01%
      regulatoryFee: 0.02 // 0.02%
    },
    MY: {
      commission: 0.15,   // 0.15%
      spread: 0.02,       // 2 pips
      exchangeFee: 0.03,  // 0.03%
      clearingFee: 0.02,  // 0.02%
      regulatoryFee: 0.01 // 0.01%
    },
    NG: {
      commission: 0.2,    // 0.2%
      spread: 0.03,       // 3 pips
      exchangeFee: 0.04,  // 0.04%
      clearingFee: 0.02,  // 0.02%
      regulatoryFee: 0.02 // 0.02%
    },
    ZA: {
      commission: 0.15,   // 0.15%
      spread: 0.02,       // 2 pips
      exchangeFee: 0.03,  // 0.03%
      clearingFee: 0.02,  // 0.02%
      regulatoryFee: 0.02 // 0.02%
    },
    KE: {
      commission: 0.2,    // 0.2%
      spread: 0.03,       // 3 pips
      exchangeFee: 0.04,  // 0.04%
      clearingFee: 0.02,  // 0.02%
      regulatoryFee: 0.02 // 0.02%
    },
    JP: {
      commission: 0.1,    // 0.1%
      spread: 0.01,       // 1 pip
      exchangeFee: 0.02,  // 0.02%
      clearingFee: 0.01,  // 0.01%
      regulatoryFee: 0.01 // 0.01%
    },
    KR: {
      commission: 0.12,   // 0.12%
      spread: 0.015,      // 1.5 pips
      exchangeFee: 0.02,  // 0.02%
      clearingFee: 0.01,  // 0.01%
      regulatoryFee: 0.01 // 0.01%
    },
    CN: {
      commission: 0.15,   // 0.15%
      spread: 0.02,       // 2 pips
      exchangeFee: 0.03,  // 0.03%
      clearingFee: 0.02,  // 0.02%
      regulatoryFee: 0.02 // 0.02%
    },
    IN: {
      commission: 0.15,   // 0.15%
      spread: 0.02,       // 2 pips
      exchangeFee: 0.03,  // 0.03%
      clearingFee: 0.02,  // 0.02%
      regulatoryFee: 0.01 // 0.01%
    },
    ID: {
      commission: 0.15,   // 0.15%
      spread: 0.02,       // 2 pips
      exchangeFee: 0.03,  // 0.03%
      clearingFee: 0.02,  // 0.02%
      regulatoryFee: 0.01 // 0.01%
    }
  };

  // New revenue streams
  private readonly additionalServices = {
    // 1. API Access
    api: {
      basic: 49.99,      // Basic API access per month
      professional: 149.99, // Professional API with higher rate limits
      enterprise: 499.99   // Custom solutions and dedicated support
    },
    
    // 2. Educational Content
    education: {
      courses: {
        beginner: 99.99,
        intermediate: 199.99,
        advanced: 299.99,
        masterclass: 499.99
      },
      webinars: {
        live: 29.99,
        recorded: 19.99,
        bundle: 99.99
      },
      personalCoaching: {
        oneHour: 149.99,
        threeHours: 399.99,
        monthly: 999.99
      }
    },

    // 3. Social Trading
    socialTrading: {
      followFee: 5.99,    // Monthly fee to follow a trader
      copyFee: 0.02,      // 2% of copied trade amount
      signalFee: 19.99,   // Monthly subscription for trading signals
      leaderboardFee: 9.99 // Monthly fee for leaderboard participation
    },

    // 4. Advanced Analytics
    analytics: {
      marketScanner: 29.99,
      portfolioAnalytics: 39.99,
      riskAnalysis: 49.99,
      aiPredictions: 59.99,
      customIndicators: 19.99
    },

    // 5. White Label Solutions
    whiteLabelSolutions: {
      setup: 9999.99,
      monthlyLicense: 999.99,
      customization: 4999.99,
      maintenance: 499.99
    },

    // 6. Data Services
    dataServices: {
      historicalData: {
        daily: 29.99,
        minute: 49.99,
        tick: 99.99
      },
      fundamentalData: 39.99,
      alternativeData: 79.99,
      customFeeds: 199.99
    },

    // 7. Premium Tools
    premiumTools: {
      tradingBots: {
        basic: 39.99,
        advanced: 79.99,
        professional: 149.99
      },
      alertSystem: 29.99,
      portfolioOptimizer: 49.99,
      backtesting: 59.99,
      paperTrading: 19.99
    },

    // 8. Corporate Services
    corporateServices: {
      compliance: 999.99,
      riskManagement: 1499.99,
      reporting: 799.99,
      training: 1999.99
    },

    // 9. Mobile Features
    mobileFeatures: {
      pushNotifications: 4.99,
      advancedCharting: 9.99,
      watchlistSync: 5.99,
      offlineMode: 7.99
    },

    // 10. VIP Services
    vipServices: {
      dedicatedManager: 999.99,
      priorityExecution: 299.99,
      customReports: 199.99,
      exclusiveWebinars: 149.99
    }
  };

  // Premium tiers with discounts
  private readonly premiumTiers = {
    basic: {
      discount: 0,        // No discount
      features: ['Basic Market Data', 'Standard Charts', 'Email Support']
    },
    pro: {
      discount: 0.2,      // 20% off trading fees
      features: ['Advanced Market Data', 'Professional Charts', 'Priority Support', 'Trading Signals']
    },
    elite: {
      discount: 0.4,      // 40% off trading fees
      features: ['Real-time Market Data', 'Advanced Analytics', '24/7 Support', 'Trading Signals', 'AI Assistant']
    }
  };

  private constructor() {}

  public static getInstance(): FeeService {
    if (!FeeService.instance) {
      FeeService.instance = new FeeService();
    }
    return FeeService.instance;
  }

  public getBaseFeeStructure(): FeeStructure {
    return { ...this.baseFeeStructure };
  }

  public getMarketFees(market: string): MarketFees {
    return { ...this.marketFees[market] };
  }

  public calculateTradingFee(amount: number, market: string, tier: 'basic' | 'pro' | 'elite' = 'basic'): number {
    const marketFees = this.marketFees[market];
    const baseFee = amount * marketFees.commission;
    const exchangeFees = amount * (
      marketFees.exchangeFee +
      marketFees.clearingFee +
      marketFees.regulatoryFee
    );
    
    // Apply tier discount to commission only
    const discount = this.premiumTiers[tier].discount;
    const discountedFee = baseFee * (1 - discount);
    
    const totalFee = discountedFee + exchangeFees;
    
    // Apply min/max limits
    return Math.min(
      Math.max(totalFee, this.baseFeeStructure.tradingFees.minAmount),
      this.baseFeeStructure.tradingFees.maxAmount
    );
  }

  public getSpread(market: string): number {
    return this.marketFees[market].spread;
  }

  public getPremiumTiers() {
    return { ...this.premiumTiers };
  }

  public getSubscriptionFees() {
    return { ...this.baseFeeStructure.subscriptionFees };
  }

  public getAdditionalFees() {
    return { ...this.baseFeeStructure.additionalFees };
  }

  public getAdditionalServices() {
    return { ...this.additionalServices };
  }

  public calculateAPIFee(tier: 'basic' | 'professional' | 'enterprise'): number {
    return this.additionalServices.api[tier];
  }

  public calculateEducationFee(type: string, level: string): number {
    return this.additionalServices.education[type][level];
  }

  public calculateSocialTradingFees(type: string): number {
    return this.additionalServices.socialTrading[type];
  }

  public calculateAnalyticsFee(feature: string): number {
    return this.additionalServices.analytics[feature];
  }

  public calculateWhiteLabelFee(service: string): number {
    return this.additionalServices.whiteLabelSolutions[service];
  }

  public calculateDataServiceFee(type: string, subtype?: string): number {
    if (subtype) {
      return this.additionalServices.dataServices[type][subtype];
    }
    return this.additionalServices.dataServices[type];
  }

  public calculatePremiumToolsFee(tool: string, tier?: string): number {
    if (tier) {
      return this.additionalServices.premiumTools[tool][tier];
    }
    return this.additionalServices.premiumTools[tool];
  }

  public calculateCorporateServiceFee(service: string): number {
    return this.additionalServices.corporateServices[service];
  }

  public calculateMobileFeatureFee(feature: string): number {
    return this.additionalServices.mobileFeatures[feature];
  }

  public calculateVIPServiceFee(service: string): number {
    return this.additionalServices.vipServices[service];
  }
}

export const feeService = FeeService.getInstance();
