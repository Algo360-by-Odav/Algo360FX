import { makeAutoObservable } from 'mobx';

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: SubscriptionFeature[];
  recommended?: boolean;
}

export interface UserSubscription {
  tierId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  autoRenew: boolean;
}

class SubscriptionService {
  private tiers: SubscriptionTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0.00,
      billingPeriod: 'monthly',
      features: [
        { id: 'basic-trading', name: 'Basic Trading Features', description: 'Access to essential trading tools', included: true },
        { id: 'market-data', name: 'Real-time Market Data', description: 'Basic market data and quotes', included: true },
        { id: 'basic-analysis', name: 'Basic Technical Analysis', description: 'Essential technical indicators', included: true },
        { id: 'portfolio', name: 'Portfolio Management', description: 'Basic portfolio tracking', included: true },
        { id: 'ai-basic', name: 'Basic AI Analysis', description: 'Limited AI-powered insights', included: true },
        { id: 'support', name: 'Email Support', description: '24/7 email support', included: true },
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 99.99,
      billingPeriod: 'monthly',
      recommended: true,
      features: [
        { id: 'advanced-trading', name: 'Advanced Trading Features', description: 'Full suite of trading tools', included: true },
        { id: 'premium-data', name: 'Premium Market Data', description: 'Advanced market data and analysis', included: true },
        { id: 'advanced-analysis', name: 'Advanced Technical Analysis', description: 'Full technical analysis suite', included: true },
        { id: 'portfolio-pro', name: 'Advanced Portfolio Tools', description: 'Advanced portfolio management', included: true },
        { id: 'ai-pro', name: 'Advanced AI Analysis', description: 'Full AI-powered trading insights', included: true },
        { id: 'priority-support', name: 'Priority Support', description: '24/7 priority support', included: true },
        { id: 'api-access', name: 'API Access', description: 'API integration capabilities', included: true },
        { id: 'custom-alerts', name: 'Custom Alerts', description: 'Personalized trading alerts', included: true },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299.99,
      billingPeriod: 'monthly',
      features: [
        { id: 'enterprise-trading', name: 'Enterprise Trading Suite', description: 'Full enterprise trading capabilities', included: true },
        { id: 'enterprise-data', name: 'Enterprise Market Data', description: 'Institutional-grade market data', included: true },
        { id: 'enterprise-analysis', name: 'Enterprise Analysis Tools', description: 'Advanced analysis and research tools', included: true },
        { id: 'portfolio-enterprise', name: 'Enterprise Portfolio Management', description: 'Advanced portfolio optimization', included: true },
        { id: 'ai-enterprise', name: 'Enterprise AI Solutions', description: 'Custom AI models and analysis', included: true },
        { id: 'dedicated-support', name: 'Dedicated Support Team', description: 'Personal account manager', included: true },
        { id: 'white-label', name: 'White Label Solutions', description: 'Customizable white-label options', included: true },
        { id: 'custom-integration', name: 'Custom Integrations', description: 'Custom API and system integrations', included: true },
        { id: 'advanced-security', name: 'Advanced Security', description: 'Enhanced security features', included: true },
      ],
    },
  ];

  currentSubscription: UserSubscription | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getTiers(): SubscriptionTier[] {
    return this.tiers;
  }

  async getCurrentSubscription(): Promise<UserSubscription | null> {
    // TODO: Implement API call to get current subscription
    return this.currentSubscription;
  }

  async subscribe(tierId: string): Promise<boolean> {
    try {
      // TODO: Implement API call to subscribe
      this.currentSubscription = {
        tierId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active',
        autoRenew: true,
      };
      return true;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return false;
    }
  }

  async cancelSubscription(): Promise<boolean> {
    try {
      // TODO: Implement API call to cancel subscription
      if (this.currentSubscription) {
        this.currentSubscription.status = 'cancelled';
        this.currentSubscription.autoRenew = false;
      }
      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }

  hasFeature(featureId: string): boolean {
    if (!this.currentSubscription) return false;
    const tier = this.tiers.find(t => t.id === this.currentSubscription?.tierId);
    return tier?.features.some(f => f.id === featureId && f.included) ?? false;
  }
}

export const subscriptionService = new SubscriptionService();
