// investorPortalStoreJs.js - JavaScript version without TypeScript
// This avoids the Vite React plugin preamble detection error

import { makeAutoObservable } from 'mobx';

export class InvestorPortalStore {
  constructor() {
    this.profile = {
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

    this.opportunities = [
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
          correlation: 0.25,
        },
        strategy: {
          type: 'Global Macro',
          instruments: ['Forex', 'Indices', 'Commodities'],
          approach: 'Systematic',
          timeframe: 'Daily',
        },
        capacity: {
          total: 50000000,
          available: 15000000,
          investors: 24,
        },
      },
      {
        id: '2',
        name: 'Forex Momentum Strategy',
        type: 'Strategy',
        manager: 'FX Capital Partners',
        status: 'Open',
        description: 'Algorithmic momentum-based strategy trading major and minor forex pairs',
        performance: {
          totalReturn: 98.5,
          annualizedReturn: 18.2,
          sharpeRatio: 1.8,
          maxDrawdown: -12.2,
          volatility: 10.5,
          monthlyReturns: [
            { month: '2024-01', return: 2.8 },
            { month: '2023-12', return: 1.5 },
            { month: '2023-11', return: 3.2 },
          ],
        },
        requirements: {
          minInvestment: 100000,
          lockupPeriod: 3,
          managementFee: 1.5,
          performanceFee: 15,
          redemptionFrequency: 'Weekly',
        },
        risk: {
          level: 'Medium',
          var: 2.2,
          beta: 0.28,
          correlation: 0.18,
        },
        strategy: {
          type: 'Momentum',
          instruments: ['Forex'],
          approach: 'Algorithmic',
          timeframe: 'H4',
        },
        capacity: {
          total: 25000000,
          available: 10000000,
          investors: 35,
        },
      },
    ];

    this.allocations = [
      {
        id: 'alloc-1',
        opportunityId: '1',
        amount: 2000000,
        startDate: '2023-06-15T00:00:00Z',
        status: 'Active',
        performance: {
          totalReturn: 12.5,
          currentValue: 2250000,
          unrealizedPnL: 250000,
          realizedPnL: 0,
        },
        transactions: [
          {
            id: 'tx-1',
            type: 'Deposit',
            amount: 2000000,
            date: '2023-06-15T00:00:00Z',
            status: 'Completed',
          },
        ],
      },
      {
        id: 'alloc-2',
        opportunityId: '2',
        amount: 500000,
        startDate: '2023-09-01T00:00:00Z',
        status: 'Active',
        performance: {
          totalReturn: 8.2,
          currentValue: 541000,
          unrealizedPnL: 41000,
          realizedPnL: 0,
        },
        transactions: [
          {
            id: 'tx-2',
            type: 'Deposit',
            amount: 500000,
            date: '2023-09-01T00:00:00Z',
            status: 'Completed',
          },
        ],
      },
    ];

    makeAutoObservable(this);
  }

  getProfile() {
    return this.profile;
  }

  getAllocations() {
    return this.allocations;
  }

  getOpportunities() {
    return this.opportunities;
  }

  getOpportunityById(id) {
    return this.opportunities.find(opp => opp.id === id);
  }

  getAllocationById(id) {
    return this.allocations.find(alloc => alloc.id === id);
  }

  createNewInvestment(request) {
    // Create new opportunity
    const opportunity = {
      id: `opp-${Date.now()}`,
      name: `Custom ${request.strategy} Strategy`,
      type: 'Strategy',
      manager: 'Self-Managed',
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
        level: request.riskLevel,
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

    // Create new allocation
    const allocation = {
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
  }

  getDurationInMonths(duration) {
    const durationMap = {
      '3M': 3,
      '6M': 6,
      '1Y': 12,
      '2Y': 24,
      '5Y': 60,
    };
    return durationMap[duration] || 12;
  }

  validateInvestment(request) {
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
  }

  getMaxLeverageForRiskLevel(riskLevel) {
    const leverageMap = {
      conservative: 2,
      moderate: 3,
      aggressive: 5,
    };
    return leverageMap[riskLevel.toLowerCase()] || 2;
  }

  getInvestmentPerformance(allocationId) {
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
  }

  calculateDuration(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
    
    if (months < 1) return 'Less than a month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
  }
}

export const investorPortalStore = new InvestorPortalStore();
export default investorPortalStore;
