import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { API_BASE_URL } from '../config';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

// Initialize Stripe only if the API key is available
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

// Log warning if Stripe key is missing
if (!stripePublicKey) {
  console.warn('Stripe API key is missing. Payment functionality will be limited to mock data.');
}
const USDT_CONTRACT_ADDRESS = import.meta.env.VITE_USDT_CONTRACT_ADDRESS;
const USDT_ABI = ['function transfer(address to, uint256 value) returns (bool)'];

export interface PaymentDetails {
  amount: number;
  currency: string;
  productId: string;
  productType: 'ebook' | 'course' | 'subscription' | 'mining_subscription';
  paymentMethod: PaymentMethod;
  customerEmail?: string;
  metadata?: Record<string, any>;
  cryptoDetails?: {
    walletAddress?: string;
    network?: CryptoNetwork;
    token?: CryptoToken;
  };
}

export type PaymentMethod = 
  | 'stripe'
  | 'paypal'
  | 'crypto_btc'
  | 'crypto_eth'
  | 'crypto_usdt'
  | 'bank_transfer'
  | 'google_pay'
  | 'apple_pay';

export type CryptoNetwork = 'ethereum' | 'bitcoin' | 'bsc' | 'polygon';
export type CryptoToken = 'ETH' | 'BTC' | 'USDT' | 'USDC';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: PaymentError;
  status: PaymentStatus;
  receipt_url?: string;
  subscriptionId?: string;
  cryptoTxHash?: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface PaymentError {
  code: string;
  message: string;
}

export interface SubscriptionDetails {
  planId: string;
  userId: string;
  interval: 'month' | 'year';
  metadata?: {
    maxRigs?: number;
    profitShare?: number;
    features?: string[];
  };
}

class PaymentService {
  private readonly baseUrl = `${API_BASE_URL}/payments`;
  private provider: Web3Provider | null = null;

  private async initializeWeb3() {
    // Use type assertion for ethereum property which may not be recognized by TypeScript
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      this.provider = new Web3Provider(ethereum);
      try {
        await this.provider.send('eth_requestAccounts', []);
      } catch (error) {
        console.error('Failed to request Ethereum accounts:', error);
      }
    }
  }

  async createMiningSubscription(details: SubscriptionDetails): Promise<PaymentResult> {
    try {
      const response = await axios.post(`${this.baseUrl}/mining/subscribe`, details);
      const { clientSecret, subscriptionId, paymentMethod } = response.data;

      let result: PaymentResult;

      switch (paymentMethod) {
        case 'stripe':
          result = await this.processStripePayment(clientSecret);
          break;
        case 'crypto_eth':
        case 'crypto_usdt':
          result = await this.processCryptoPayment(response.data);
          break;
        default:
          throw new Error('Unsupported payment method');
      }

      if (result.success) {
        await this.notifyUser('subscription_created', {
          subscriptionId,
          planId: details.planId
        });
      }

      return { ...result, subscriptionId };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'payment_failed',
          message: error.message || 'Failed to process subscription'
        },
        status: 'failed'
      };
    }
  }

  private async processStripePayment(clientSecret: string): Promise<PaymentResult> {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const result = await stripe.confirmCardPayment(clientSecret);
    if (result.error) throw result.error;

    // Use type assertion for PaymentIntent to access charges property
    const paymentIntent = result.paymentIntent as any;
    
    return {
      success: true,
      transactionId: paymentIntent?.id,
      status: 'completed',
      receipt_url: paymentIntent?.charges?.data[0]?.receipt_url
    };
  }

  private async processCryptoPayment(data: {
    amount: number;
    walletAddress: string;
    token: CryptoToken;
  }): Promise<PaymentResult> {
    if (!this.provider) {
      await this.initializeWeb3();
      if (!this.provider) throw new Error('Web3 provider not available');
    }

    try {
      let txHash: string;

      if (data.token === 'ETH') {
        const signer = this.provider.getSigner();
        const tx = await signer.sendTransaction({
          to: data.walletAddress,
          value: data.amount
        });
        txHash = tx.hash;
      } else if (data.token === 'USDT') {
        const contract = new Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, this.provider.getSigner());
        const tx = await contract.transfer(data.walletAddress, data.amount);
        txHash = tx.hash;
      } else {
        throw new Error('Unsupported token');
      }

      return {
        success: true,
        status: 'completed',
        cryptoTxHash: txHash
      };
    } catch (error: any) {
      throw new Error(`Crypto payment failed: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<PaymentResult> {
    try {
      const response = await axios.post(`${this.baseUrl}/mining/cancel`, {
        subscriptionId
      });

      await this.notifyUser('subscription_cancelled', { subscriptionId });

      return {
        success: true,
        status: 'completed',
        subscriptionId: response.data.subscriptionId
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'cancellation_failed',
          message: error.message || 'Failed to cancel subscription'
        },
        status: 'failed'
      };
    }
  }

  private async notifyUser(event: string, data: any) {
    try {
      await axios.post(`${this.baseUrl}/notifications`, {
        event,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  async getPaymentMethods(): Promise<Array<{
    id: PaymentMethod;
    name: string;
    icon: string;
    enabled: boolean;
    fees?: string;
  }>> {
    try {
      // Try to fetch payment methods from the backend
      const response = await axios.get(`${this.baseUrl}/methods`);
      return response.data;
    } catch (error) {
      console.warn('Using mock payment methods due to backend unavailability');
      
      // Return mock payment methods
      return [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        icon: 'credit_card',
        enabled: true,
        fees: '2.9% + $0.30'
      },
      {
        id: 'crypto_eth',
        name: 'Ethereum (ETH)',
        icon: 'eth_logo',
        enabled: true,
        fees: 'Network fee only'
      },
      {
        id: 'crypto_usdt',
        name: 'USDT',
        icon: 'usdt_logo',
        enabled: true,
        fees: 'Network fee only'
      },
      {
        id: 'crypto_btc',
        name: 'Bitcoin (BTC)',
        icon: 'btc_logo',
        enabled: true,
        fees: 'Network fee only'
      }
    ];
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
