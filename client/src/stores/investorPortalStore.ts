import { makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';

export interface InvestorProfile {
  id: string;
  name: string;
  type: 'Individual' | 'Institutional';
  status: 'Active' | 'Pending' | 'Suspended';
  accountSize: number;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  investmentHorizon: 'Short' | 'Medium' | 'Long';
  preferences: {
    instruments: string[];
    strategies: string[];
    maxDrawdown: number;
    targetReturn: number;
  };
  performance: {
    totalReturn: number;
    monthlyReturn: number;
    yearToDate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
  };
  portfolio: {
    totalValue: number;
    cashBalance: number;
    marginUsed: number;
    openPositions: number;
    pnl: number;
  };
}

export interface InvestmentOpportunity {
  id: string;
  name: string;
  type: 'Strategy' | 'Fund' | 'Signal Provider' | 'Managed Account';
  manager: string;
  status: 'Open' | 'Closed' | 'Coming Soon';
  description: string;
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    monthlyReturns: { month: string; return: number }[];
  };
  requirements: {
    minInvestment: number;
    lockupPeriod: number;
    managementFee: number;
    performanceFee: number;
    redemptionFrequency: string;
  };
  risk: {
    level: 'Low' | 'Medium' | 'High';
    var: number;
    beta: number;
    correlation: number;
  };
  strategy: {
    type: string;
    instruments: string[];
    approach: string;
    timeframe: string;
  };
  capacity: {
    total: number;
    available: number;
    investors: number;
  };
}

export interface InvestmentAllocation {
  id: string;
  opportunityId: string;
  amount: number;
  startDate: string;
  status: 'Active' | 'Pending' | 'Redeemed';
  performance: {
    totalReturn: number;
    currentValue: number;
    unrealizedPnL: number;
    realizedPnL: number;
  };
  transactions: {
    id: string;
    type: 'Deposit' | 'Withdrawal' | 'Fee' | 'Profit Share';
    amount: number;
    date: string;
    status: 'Completed' | 'Pending' | 'Failed';
  }[];
}

export interface NewInvestmentRequest {
  amount: number;
  strategy: string;
  riskLevel: string;
  duration: string;
  reinvestDividends: boolean;
  leverageLevel: number;
}

export class InvestorPortalStore {
  profile: InvestorProfile = {
    id: '1',
    name: 'Alpha Capital Management',
    type: 'Institutional',
    status: 'Active',
    accountSize: 10000000,
    riskProfile: 'Moderate',
    investmentHorizon: 'Medium',
    preferences: {
      instruments: ['Forex', 'Commodities', 'Indices'],
      strategies: ['Trend Following', 'Mean Reversion', 'Statistical Arbitrage'],
      maxDrawdown: 15,
      targetReturn: 25,
    },
    performance: {
      totalReturn: 45.8,
      monthlyReturn: 3.2,
      yearToDate: 18.5,
      sharpeRatio: 2.1,
      maxDrawdown: -12.5,
      winRate: 68,
      profitFactor: 2.4,
    },
    portfolio: {
      totalValue: 12500000,
      cashBalance: 2500000,
      marginUsed: 3000000,
      openPositions: 12,
      pnl: 450000,
    },
  };

  opportunities: InvestmentOpportunity[] = [
    {
      id: '1',
      name: 'Global Macro Alpha Fund',
      type: 'Fund',
      manager: 'Quantum Capital',
      status: 'Open',
      description: 'Systematic global macro strategy focusing on G10 currencies and major indices',
      performance: {
        totalReturn: 156.8,
        annualizedReturn: 28.5,
        sharpeRatio: 2.4,
        maxDrawdown: -15.5,
        volatility: 12.8,
        monthlyReturns: [
          { month: '2024-01', return: 4.5 },
          { month: '2023-12', return: 3.8 },
          { month: '2023-11', return: 5.2 },
        ],
      },
      requirements: {
        minInvestment: 500000,
        lockupPeriod: 12,
        managementFee: 2,
        performanceFee: 20,
        redemptionFrequency: 'Monthly',
      },
      risk: {
        level: 'Medium',
        var: 2.5,
        beta: 0.35,
        correlation: 0.15,
      },
      strategy: {
        type: 'Systematic Global Macro',
        instruments: ['Forex', 'Indices', 'Commodities'],
        approach: 'Trend Following + Mean Reversion',
        timeframe: 'Daily/Weekly',
      },
      capacity: {
        total: 100000000,
        available: 25000000,
        investors: 45,
      },
    },
    {
      id: '2',
      name: 'FX Alpha Strategy',
      type: 'Strategy',
      manager: 'Precision Trading',
      status: 'Open',
      description: 'High-frequency forex trading strategy focusing on major currency pairs',
      performance: {
        totalReturn: 98.5,
        annualizedReturn: 32.8,
        sharpeRatio: 2.8,
        maxDrawdown: -12.5,
        volatility: 10.5,
        monthlyReturns: [
          { month: '2024-01', return: 5.8 },
          { month: '2023-12', return: 4.2 },
          { month: '2023-11', return: 3.9 },
        ],
      },
      requirements: {
        minInvestment: 250000,
        lockupPeriod: 6,
        managementFee: 1.5,
        performanceFee: 25,
        redemptionFrequency: 'Weekly',
      },
      risk: {
        level: 'High',
        var: 3.2,
        beta: 0.25,
        correlation: 0.08,
      },
      strategy: {
        type: 'Statistical Arbitrage',
        instruments: ['Forex'],
        approach: 'High-Frequency Trading',
        timeframe: 'Intraday',
      },
      capacity: {
        total: 50000000,
        available: 15000000,
        investors: 28,
      },
    },
  ];

  allocations: InvestmentAllocation[] = [
    {
      id: '1',
      opportunityId: '1',
      amount: 1000000,
      startDate: '2024-01-01',
      status: 'Active',
      performance: {
        totalReturn: 8.5,
        currentValue: 1085000,
        unrealizedPnL: 85000,
        realizedPnL: 0,
      },
      transactions: [
        {
          id: '1',
          type: 'Deposit',
          amount: 1000000,
          date: '2024-01-01',
          status: 'Completed',
        },
        {
          id: '2',
          type: 'Fee',
          amount: -5000,
          date: '2024-01-31',
          status: 'Completed',
        },
      ],
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  getProfile = () => {
    return this.profile;
  };

  getOpportunities = () => {
    return this.opportunities;
  };

  getAllocations = () => {
    return this.allocations;
  };

  getOpportunityById = (id: string) => {
    return this.opportunities.find(opp => opp.id === id);
  };

  getAllocationById = (id: string) => {
    return this.allocations.find(alloc => alloc.id === id);
  };

  updateProfile = (profile: Partial<InvestorProfile>) => {
    this.profile = { ...this.profile, ...profile };
  };

  createAllocation = (allocation: InvestmentAllocation) => {
    this.allocations.push(allocation);
  };

  updateAllocation = (id: string, update: Partial<InvestmentAllocation>) => {
    const allocation = this.allocations.find(a => a.id === id);
    if (allocation) {
      Object.assign(allocation, update);
    }
  };

  addTransaction = (allocationId: string, transaction: any) => {
    const allocation = this.allocations.find(a => a.id === allocationId);
    if (allocation) {
      allocation.transactions.push(transaction);
    }
  };

  createNewInvestment = async (request: NewInvestmentRequest): Promise<InvestmentAllocation> => {
    // Validate investment amount against available cash balance
    if (request.amount > this.profile.portfolio.cashBalance) {
      throw new Error('Insufficient funds for investment');
    }

    // Find matching strategy or create custom strategy
    let opportunity = this.opportunities.find(opp => 
      opp.strategy.type.toLowerCase() === request.strategy.toLowerCase() &&
      opp.risk.level.toLowerCase() === request.riskLevel.toLowerCase()
    );

    if (!opportunity) {
      // Create new opportunity for custom strategy
      opportunity = {
        id: `custom-${Date.now()}`,
        name: `Custom ${request.strategy} Strategy`,
        type: 'Strategy',
        manager: this.profile.name,
        status: 'Open',
        description: `Custom ${request.strategy} strategy with ${request.riskLevel} risk profile`,
        performance: {
          totalReturn: 0,
          annualizedReturn: 0,
          sharpeRatio: 0,
          maxDrawdown: 0,
          volatility: 0,
          monthlyReturns: [],
        },
        requirements: {
          minInvestment: request.amount,
          lockupPeriod: this.getDurationInMonths(request.duration),
          managementFee: 1,
          performanceFee: 20,
          redemptionFrequency: 'Monthly',
        },
        risk: {
          level: request.riskLevel as 'Low' | 'Medium' | 'High',
          var: 0,
          beta: 0,
          correlation: 0,
        },
        strategy: {
          type: request.strategy,
          instruments: ['Forex'],
          approach: request.strategy,
          timeframe: 'Daily',
        },
        capacity: {
          total: request.amount * 2,
          available: request.amount,
          investors: 1,
        },
      };
      this.opportunities.push(opportunity);
    }

    // Create new allocation
    const allocation: InvestmentAllocation = {
      id: `alloc-${Date.now()}`,
      opportunityId: opportunity.id,
      amount: request.amount,
      startDate: new Date().toISOString(),
      status: 'Active',
      performance: {
        totalReturn: 0,
        currentValue: request.amount,
        unrealizedPnL: 0,
        realizedPnL: 0,
      },
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'Deposit',
          amount: request.amount,
          date: new Date().toISOString(),
          status: 'Completed',
        },
      ],
    };

    // Update portfolio cash balance
    this.profile.portfolio.cashBalance -= request.amount;
    this.profile.portfolio.marginUsed += request.amount * request.leverageLevel;

    // Add allocation to the list
    this.allocations.push(allocation);

    return allocation;
  };

  getDurationInMonths = (duration: string): number => {
    const durationMap: { [key: string]: number } = {
      '3M': 3,
      '6M': 6,
      '1Y': 12,
      '2Y': 24,
      '5Y': 60,
    };
    return durationMap[duration] || 12;
  };

  validateInvestment = (request: NewInvestmentRequest): string | null => {
    if (request.amount <= 0) {
      return 'Investment amount must be greater than 0';
    }

    if (request.amount > this.profile.portfolio.cashBalance) {
      return 'Insufficient funds for investment';
    }

    if (request.leverageLevel < 1 || request.leverageLevel > 5) {
      return 'Leverage level must be between 1 and 5';
    }

    const maxLeverage = this.getMaxLeverageForRiskLevel(request.riskLevel);
    if (request.leverageLevel > maxLeverage) {
      return `Maximum leverage for ${request.riskLevel} risk level is ${maxLeverage}x`;
    }

    return null;
  };

  getMaxLeverageForRiskLevel = (riskLevel: string): number => {
    const leverageMap: { [key: string]: number } = {
      conservative: 2,
      moderate: 3,
      aggressive: 5,
    };
    return leverageMap[riskLevel.toLowerCase()] || 2;
  };

  getInvestmentPerformance = (allocationId: string) => {
    const allocation = this.getAllocationById(allocationId);
    if (!allocation) return null;

    const opportunity = this.getOpportunityById(allocation.opportunityId);
    if (!opportunity) return null;

    return {
      allocation,
      opportunity,
      metrics: {
        roi: (allocation.performance.currentValue - allocation.amount) / allocation.amount * 100,
        duration: this.calculateDuration(allocation.startDate),
        annualizedReturn: opportunity.performance.annualizedReturn,
        riskMetrics: {
          sharpeRatio: opportunity.performance.sharpeRatio,
          maxDrawdown: opportunity.performance.maxDrawdown,
          volatility: opportunity.performance.volatility,
        },
      },
    };
  };

  calculateDuration = (startDate: string): string => {
    const start = new Date(startDate);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
    
    if (months < 1) return 'Less than a month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
  };
}
