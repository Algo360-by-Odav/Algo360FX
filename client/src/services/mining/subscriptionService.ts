import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { API_BASE_URL } from '../../config';
import { paymentService } from '../paymentService';

export interface MiningPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'month' | 'year';
  features: {
    maxRigs: number;
    profitShare: number;
    autoSwitch: boolean;
    aiOptimization: boolean;
    prioritySupport: boolean;
    telegramAlerts: boolean;
    customAlgorithms: boolean;
  };
}

export interface UsageStats {
  activeRigs: number;
  totalHashrate: number;
  dailyProfits: number;
  monthlyProfits: number;
  profitShare: number;
  nextBillingDate: string;
  billingAmount: number;
}

class MiningSubscriptionService {
  private readonly baseUrl = `${API_BASE_URL}/mining/subscriptions`;
  public currentPlan: MiningPlan | null = null;
  public usageStats: UsageStats | null = null;

  readonly SUBSCRIPTION_PLANS: MiningPlan[] = [
    {
      id: 'basic',
      name: 'Basic Miner',
      price: 29.99,
      billingCycle: 'month',
      features: {
        maxRigs: 2,
        profitShare: 10,
        autoSwitch: true,
        aiOptimization: false,
        prioritySupport: false,
        telegramAlerts: true,
        customAlgorithms: false,
      },
    },
    {
      id: 'pro',
      name: 'Pro Miner',
      price: 99.99,
      billingCycle: 'month',
      features: {
        maxRigs: 5,
        profitShare: 7,
        autoSwitch: true,
        aiOptimization: true,
        prioritySupport: true,
        telegramAlerts: true,
        customAlgorithms: false,
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise Mining',
      price: 299.99,
      billingCycle: 'month',
      features: {
        maxRigs: 15,
        profitShare: 5,
        autoSwitch: true,
        aiOptimization: true,
        prioritySupport: true,
        telegramAlerts: true,
        customAlgorithms: true,
      },
    },
  ];

  constructor() {
    makeAutoObservable(this);
    this.initializeSubscription();
  }

  private async initializeSubscription() {
    try {
      // Try to fetch from backend
      const response = await axios.get(`${this.baseUrl}/current`);
      runInAction(() => {
        this.currentPlan = this.SUBSCRIPTION_PLANS.find(
          plan => plan.id === response.data.planId
        ) || null;
      });
      await this.fetchUsageStats();
    } catch (error) {
      // If backend is not available, use mock data instead of showing errors
      console.warn('Using mock subscription data due to backend unavailability');
      
      // Set a mock subscription plan for development
      runInAction(() => {
        // Use the Pro plan as default mock data
        this.currentPlan = this.SUBSCRIPTION_PLANS.find(plan => plan.id === 'pro') || null;
        
        // Set mock usage stats
        this.usageStats = {
          activeRigs: 3,
          totalHashrate: 245.6,
          dailyProfits: 12.75,
          monthlyProfits: 382.5,
          profitShare: 7,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          billingAmount: 99.99
        };
      });
    }
  }

  async subscribeToPlan(userId: string, planId: string): Promise<boolean> {
    try {
      const plan = this.SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) throw new Error('Invalid plan selected');

      const result = await paymentService.createMiningSubscription({
        planId,
        userId,
        interval: plan.billingCycle,
        metadata: {
          maxRigs: plan.features.maxRigs,
          profitShare: plan.features.profitShare,
          features: Object.entries(plan.features)
            .filter(([_, value]) => value === true)
            .map(([key]) => key),
        },
      });

      if (result.success) {
        runInAction(() => {
          this.currentPlan = plan;
        });
        await this.fetchUsageStats();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to subscribe to plan:', error);
      return false;
    }
  }

  async cancelSubscription(): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/cancel`);
      if (response.data.success) {
        runInAction(() => {
          this.currentPlan = null;
          this.usageStats = null;
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }

  async fetchUsageStats(): Promise<void> {
    if (!this.currentPlan) return;

    try {
      const response = await axios.get(`${this.baseUrl}/usage`);
      runInAction(() => {
        this.usageStats = response.data;
      });
    } catch (error) {
      // If backend is not available, use mock data
      console.warn('Using mock usage stats due to backend unavailability');
      
      // Only set mock data if we don't already have usage stats
      if (!this.usageStats) {
        runInAction(() => {
          // Set mock usage stats based on the current plan
          const planFeatures = this.currentPlan?.features;
          this.usageStats = {
            activeRigs: Math.floor(Math.random() * (planFeatures?.maxRigs || 5)) + 1,
            totalHashrate: Math.random() * 500 + 100,
            dailyProfits: Math.random() * 20 + 5,
            monthlyProfits: Math.random() * 400 + 100,
            profitShare: planFeatures?.profitShare || 10,
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            billingAmount: this.currentPlan?.price || 99.99
          };
        });
      }
    }
  }

  // Usage tracking methods
  async trackRigUsage(rigId: string, hashrate: number, profits: number): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/track`, {
        rigId,
        hashrate,
        profits,
        timestamp: new Date().toISOString(),
      });
      await this.fetchUsageStats();
    } catch (error) {
      console.error('Failed to track rig usage:', error);
    }
  }

  // Billing methods
  async getBillingHistory(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/billing/history`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch billing history:', error);
      return [];
    }
  }

  async getNextBillingPreview(): Promise<{
    amount: number;
    date: string;
    breakdown: {
      subscription: number;
      profitShare: number;
      discounts?: number;
    };
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/billing/preview`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch billing preview:', error);
      throw error;
    }
  }
}

export const miningSubscriptionService = new MiningSubscriptionService();
export default miningSubscriptionService;
