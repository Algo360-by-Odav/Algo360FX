import axios from 'axios';

export interface PaymentDetails {
  amount: number;
  currency: string;
  productId: string;
  productType: 'ebook' | 'course' | 'subscription';
  paymentMethod: PaymentMethod;
  customerEmail?: string;
  metadata?: Record<string, any>;
}

export type PaymentMethod = 
  | 'stripe'
  | 'paypal'
  | 'crypto_btc'
  | 'crypto_eth'
  | 'bank_transfer'
  | 'google_pay'
  | 'apple_pay';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: PaymentError;
  status: PaymentStatus;
  receipt_url?: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface PaymentError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  fees?: string;
  processingTime?: string;
}

class PaymentService {
  private readonly API_URL = import.meta.env.VITE_API_URL || '';
  private readonly STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  private readonly PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Keep track of payment status
  private paymentStatuses: Map<string, PaymentStatus> = new Map();

  constructor() {
    // Initialize payment providers
    this.initializePaymentProviders();
  }

  private async initializePaymentProviders() {
    // Load Stripe
    if (this.STRIPE_PUBLIC_KEY) {
      const stripe = await import('@stripe/stripe-js');
      await stripe.loadStripe(this.STRIPE_PUBLIC_KEY);
    }

    // Load PayPal
    if (this.PAYPAL_CLIENT_ID) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.PAYPAL_CLIENT_ID}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }

  async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      // Validate payment details
      this.validatePaymentDetails(details);

      // Initialize payment based on method
      const paymentIntent = await this.initializePayment(details);

      // Start tracking payment status
      this.paymentStatuses.set(paymentIntent.transactionId, 'processing');

      // Process payment based on method
      const result = await this.processPaymentByMethod(details, paymentIntent);

      // Update payment status
      this.paymentStatuses.set(paymentIntent.transactionId, result.status);

      return result;
    } catch (error) {
      return this.handlePaymentError(error);
    }
  }

  private validatePaymentDetails(details: PaymentDetails): void {
    if (!details.amount || details.amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    if (!details.currency) {
      throw new Error('Currency is required');
    }
    if (!details.productId) {
      throw new Error('Product ID is required');
    }
    if (!this.isValidPaymentMethod(details.paymentMethod)) {
      throw new Error('Invalid payment method');
    }
  }

  private async initializePayment(details: PaymentDetails): Promise<{ transactionId: string }> {
    try {
      const response = await axios.post(`${this.API_URL}/api/payments/initialize`, details);
      return response.data;
    } catch (error) {
      throw new Error('Failed to initialize payment');
    }
  }

  private async processPaymentByMethod(
    details: PaymentDetails,
    paymentIntent: { transactionId: string }
  ): Promise<PaymentResult> {
    switch (details.paymentMethod) {
      case 'stripe':
        return await this.processStripePayment(details, paymentIntent);
      case 'paypal':
        return await this.processPayPalPayment(details, paymentIntent);
      case 'crypto_btc':
      case 'crypto_eth':
        return await this.processCryptoPayment(details, paymentIntent);
      case 'bank_transfer':
        return await this.processBankTransfer(details, paymentIntent);
      case 'google_pay':
      case 'apple_pay':
        return await this.processWalletPayment(details, paymentIntent);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  private handlePaymentError(error: any): PaymentResult {
    const paymentError: PaymentError = {
      code: 'payment_failed',
      message: error.message || 'Payment processing failed',
      details: error.response?.data,
    };

    return {
      success: false,
      error: paymentError,
      status: 'failed',
    };
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const response = await axios.get(`${this.API_URL}/api/payments/${transactionId}/status`);
      const status = response.data.status as PaymentStatus;
      this.paymentStatuses.set(transactionId, status);
      return status;
    } catch (error) {
      console.error('Failed to fetch payment status:', error);
      return this.paymentStatuses.get(transactionId) || 'failed';
    }
  }

  getPaymentMethods(): PaymentMethodInfo[] {
    return [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        icon: 'credit_card',
        description: 'Pay securely with your credit or debit card',
        enabled: true,
        fees: '2.9% + $0.30',
        processingTime: 'Instant',
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: 'paypal',
        description: 'Pay with your PayPal account',
        enabled: true,
        fees: '2.9% + $0.30',
        processingTime: 'Instant',
      },
      {
        id: 'crypto_btc',
        name: 'Bitcoin',
        icon: 'currency_bitcoin',
        description: 'Pay with Bitcoin',
        enabled: true,
        fees: '1%',
        processingTime: '~10-60 minutes',
      },
      {
        id: 'crypto_eth',
        name: 'Ethereum',
        icon: 'currency_eth',
        description: 'Pay with Ethereum',
        enabled: true,
        fees: '1%',
        processingTime: '~5 minutes',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        icon: 'account_balance',
        description: 'Pay directly from your bank account',
        enabled: true,
        fees: 'Free',
        processingTime: '2-3 business days',
      },
      {
        id: 'google_pay',
        name: 'Google Pay',
        icon: 'google_pay',
        description: 'Pay with Google Pay',
        enabled: true,
        fees: '2.9%',
        processingTime: 'Instant',
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: 'apple_pay',
        description: 'Pay with Apple Pay',
        enabled: true,
        fees: '2.9%',
        processingTime: 'Instant',
      },
    ];
  }

  private isValidPaymentMethod(method: string): method is PaymentMethod {
    return this.getPaymentMethods().some(pm => pm.id === method);
  }

  // Implementation of specific payment methods
  private async processStripePayment(
    details: PaymentDetails,
    paymentIntent: { transactionId: string }
  ): Promise<PaymentResult> {
    // Implement Stripe payment processing
    return {
      success: true,
      transactionId: paymentIntent.transactionId,
      status: 'completed',
      receipt_url: `${this.API_URL}/receipts/${paymentIntent.transactionId}`,
    };
  }

  private async processPayPalPayment(
    details: PaymentDetails,
    paymentIntent: { transactionId: string }
  ): Promise<PaymentResult> {
    // Implement PayPal payment processing
    return {
      success: true,
      transactionId: paymentIntent.transactionId,
      status: 'completed',
      receipt_url: `${this.API_URL}/receipts/${paymentIntent.transactionId}`,
    };
  }

  private async processCryptoPayment(
    details: PaymentDetails,
    paymentIntent: { transactionId: string }
  ): Promise<PaymentResult> {
    // Implement crypto payment processing
    return {
      success: true,
      transactionId: paymentIntent.transactionId,
      status: 'processing', // Crypto payments need confirmation
    };
  }

  private async processBankTransfer(
    details: PaymentDetails,
    paymentIntent: { transactionId: string }
  ): Promise<PaymentResult> {
    // Implement bank transfer processing
    return {
      success: true,
      transactionId: paymentIntent.transactionId,
      status: 'pending', // Bank transfers are not instant
    };
  }

  private async processWalletPayment(
    details: PaymentDetails,
    paymentIntent: { transactionId: string }
  ): Promise<PaymentResult> {
    // Implement wallet payment processing
    return {
      success: true,
      transactionId: paymentIntent.transactionId,
      status: 'completed',
      receipt_url: `${this.API_URL}/receipts/${paymentIntent.transactionId}`,
    };
  }
}

export const paymentService = new PaymentService();
