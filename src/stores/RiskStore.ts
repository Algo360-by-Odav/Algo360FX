import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';

interface RiskMetrics {
  totalExposure: number;
  marginUsage: number;
  exposureBySymbol: Record<string, number>;
  exposureByBase: Record<string, number>;
  riskScore: number;
}

export class RiskStore {
  private rootStore: RootStore;
  private updateInterval: NodeJS.Timeout | null = null;
  public metrics: RiskMetrics = {
    totalExposure: 0,
    marginUsage: 0,
    exposureBySymbol: {},
    exposureByBase: {},
    riskScore: 0,
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  startMonitoring() {
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => this.updateRiskMetrics(), 60000);
      this.updateRiskMetrics();
    }
  }

  stopMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private async updateRiskMetrics() {
    try {
      const { tradeStore } = this.rootStore;
      const positions = tradeStore.positions || [];
      const balance = tradeStore.balance || 0;
      const equity = tradeStore.equity || 0;

      const exposureBySymbol: Record<string, number> = {};
      const exposureByBase: Record<string, number> = {};

      // Calculate exposures
      positions.forEach(position => {
        const exposure = position.size * position.price;
        exposureBySymbol[position.symbol] = (exposureBySymbol[position.symbol] || 0) + exposure;
        
        const baseSymbol = position.symbol.substring(0, 3);
        exposureByBase[baseSymbol] = (exposureByBase[baseSymbol] || 0) + exposure;
      });

      const totalExposure = Object.values(exposureBySymbol).reduce((sum, val) => sum + val, 0);
      const marginUsage = balance > 0 ? (totalExposure / balance) * 100 : 0;

      // Calculate risk score (0-100)
      const riskScore = this.calculateRiskScore({
        positions,
        totalExposure,
        marginUsage,
        balance,
        equity,
      });

      runInAction(() => {
        this.metrics = {
          totalExposure,
          marginUsage,
          exposureBySymbol,
          exposureByBase,
          riskScore,
        };
      });
    } catch (error) {
      console.error('Error updating risk metrics:', error);
    }
  }

  private calculateRiskScore(params: {
    positions: any[];
    totalExposure: number;
    marginUsage: number;
    balance: number;
    equity: number;
  }): number {
    const { positions, totalExposure, marginUsage, balance, equity } = params;
    
    // Weight factors for different risk components
    const weights = {
      positionCount: 0.2,
      exposure: 0.3,
      marginUsage: 0.3,
      equityRatio: 0.2,
    };

    // Position count risk (more positions = higher risk)
    const maxPositions = 10;
    const positionRisk = Math.min((positions.length / maxPositions) * 100, 100);

    // Exposure risk (higher exposure relative to balance = higher risk)
    const maxExposureRatio = 5; // 500% of balance
    const exposureRisk = Math.min((totalExposure / (balance * maxExposureRatio)) * 100, 100);

    // Margin usage risk
    const marginRisk = Math.min(marginUsage, 100);

    // Equity ratio risk (lower equity ratio = higher risk)
    const equityRatio = (equity / balance) * 100;
    const equityRisk = Math.max(0, Math.min(100 - equityRatio, 100));

    // Calculate weighted average risk score
    const riskScore = 
      (positionRisk * weights.positionCount) +
      (exposureRisk * weights.exposure) +
      (marginRisk * weights.marginUsage) +
      (equityRisk * weights.equityRatio);

    return Math.round(riskScore);
  }

  dispose() {
    this.stopMonitoring();
  }
}
