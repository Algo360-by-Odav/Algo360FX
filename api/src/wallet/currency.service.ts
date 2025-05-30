import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  private exchangeRateApiKey: string;
  
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // In production, you would use a real exchange rate API like Open Exchange Rates or Fixer.io
    this.exchangeRateApiKey = this.configService.get('EXCHANGE_RATE_API_KEY') || 'demo-api-key';
  }

  /**
   * Get all currency wallets for a user
   */
  async getCurrencyWallets(userId: string) {
    const wallets = await this.prisma.currencyWallet.findMany({
      where: { userId }
    });
    
    // Calculate USD equivalent for all wallets
    const currencies = wallets.map(wallet => wallet.currency);
    const exchangeRates = await this.getExchangeRates('USD', currencies);
    
    // Add USD value to each wallet
    const walletsWithValues = wallets.map(wallet => {
      const rate = wallet.currency === 'USD' ? 1 : (1 / exchangeRates[wallet.currency] || 0);
      const valueUSD = wallet.balance * rate;
      
      return {
        ...wallet,
        exchangeRate: rate,
        valueUSD
      };
    });
    
    return walletsWithValues;
  }

  /**
   * Get a specific currency wallet
   */
  async getCurrencyWallet(userId: string, currency: string) {
    const wallet = await this.prisma.currencyWallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency
        }
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });
    
    if (!wallet) {
      return null;
    }
    
    // Get exchange rate to USD
    const exchangeRates = await this.getExchangeRates('USD', [currency]);
    const rate = currency === 'USD' ? 1 : (1 / exchangeRates[currency] || 0);
    
    return {
      ...wallet,
      exchangeRate: rate,
      valueUSD: wallet.balance * rate
    };
  }

  /**
   * Create a new currency wallet for a user
   */
  async createCurrencyWallet(userId: string, currency: string) {
    // Validate currency code
    if (!this.isValidCurrencyCode(currency)) {
      throw new Error('Invalid currency code');
    }
    
    // Check if wallet already exists
    const existingWallet = await this.prisma.currencyWallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency
        }
      }
    });
    
    if (existingWallet) {
      return existingWallet;
    }
    
    // Check if this is the first wallet for the user
    const walletCount = await this.prisma.currencyWallet.count({
      where: { userId }
    });
    
    // Create wallet
    return this.prisma.currencyWallet.create({
      data: {
        userId,
        currency,
        balance: 0,
        isDefault: walletCount === 0 // Make default if first wallet
      }
    });
  }

  /**
   * Set a currency wallet as default
   */
  async setDefaultCurrencyWallet(userId: string, currency: string) {
    // Find the wallet
    const wallet = await this.prisma.currencyWallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency
        }
      }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Clear default flag from all user wallets
    await this.prisma.currencyWallet.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
    
    // Set this wallet as default
    return this.prisma.currencyWallet.update({
      where: { id: wallet.id },
      data: { isDefault: true }
    });
  }

  /**
   * Deposit funds to a currency wallet
   */
  async deposit(userId: string, data: { currency: string, amount: number, paymentMethodId?: string }) {
    const { currency, amount, paymentMethodId } = data;
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    // Validate currency
    if (!this.isValidCurrencyCode(currency)) {
      throw new Error('Invalid currency code');
    }
    
    // Check if payment method exists and belongs to user
    if (paymentMethodId) {
      const paymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId }
      });
      
      if (!paymentMethod || paymentMethod.userId !== userId) {
        throw new Error('Payment method not found');
      }
    }
    
    // Get or create wallet
    let wallet = await this.prisma.currencyWallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency
        }
      }
    });
    
    if (!wallet) {
      wallet = await this.createCurrencyWallet(userId, currency);
    }
    
    // Create transaction
    const transaction = await this.prisma.currencyTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'DEPOSIT',
        status: 'PENDING',
        reference: `dep-${uuidv4()}`,
        description: `Deposit ${amount} ${currency}`,
        paymentMethodId,
        fee: 0
      }
    });
    
    // In a real application, you would integrate with a payment processor here
    // For demo purposes, we'll simulate successful payment processing
    
    // Update transaction status after payment processing
    setTimeout(async () => {
      await this.prisma.currencyTransaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' }
      });
      
      // Update wallet balance
      await this.prisma.currencyWallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: amount
          }
        }
      });
    }, 5000); // Simulate 5-second processing time
    
    return {
      message: 'Deposit initiated successfully',
      transaction
    };
  }

  /**
   * Withdraw funds from a currency wallet
   */
  async withdraw(userId: string, data: { currency: string, amount: number, paymentMethodId: string }) {
    const { currency, amount, paymentMethodId } = data;
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    // Check if payment method exists and belongs to user
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });
    
    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new Error('Payment method not found');
    }
    
    // Get wallet
    const wallet = await this.prisma.currencyWallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency
        }
      }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Check sufficient balance
    if (wallet.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    // Create transaction
    const transaction = await this.prisma.currencyTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'WITHDRAWAL',
        status: 'PENDING',
        reference: `wit-${uuidv4()}`,
        description: `Withdrawal ${amount} ${currency}`,
        paymentMethodId,
        fee: 0
      }
    });
    
    // Update wallet balance (pending withdrawal)
    await this.prisma.currencyWallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          decrement: amount
        }
      }
    });
    
    // In a real application, you would integrate with a payment processor here
    // For demo purposes, we'll simulate successful withdrawal processing
    setTimeout(async () => {
      await this.prisma.currencyTransaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' }
      });
    }, 5000); // Simulate 5-second processing time
    
    return {
      message: 'Withdrawal initiated successfully',
      transaction
    };
  }

  /**
   * Convert funds between currencies
   */
  async convertCurrency(userId: string, data: { 
    fromCurrency: string, 
    toCurrency: string, 
    amount: number 
  }) {
    const { fromCurrency, toCurrency, amount } = data;
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    if (fromCurrency === toCurrency) {
      throw new Error('Source and destination currencies must be different');
    }
    
    // Validate currency codes
    if (!this.isValidCurrencyCode(fromCurrency) || !this.isValidCurrencyCode(toCurrency)) {
      throw new Error('Invalid currency code');
    }
    
    // Get source wallet
    const sourceWallet = await this.prisma.currencyWallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency: fromCurrency
        }
      }
    });
    
    if (!sourceWallet) {
      throw new Error('Source wallet not found');
    }
    
    // Check sufficient balance
    if (sourceWallet.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    // Get or create destination wallet
    let destWallet = await this.prisma.currencyWallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency: toCurrency
        }
      }
    });
    
    if (!destWallet) {
      destWallet = await this.createCurrencyWallet(userId, toCurrency);
    }
    
    // Get exchange rate
    const exchangeRates = await this.getExchangeRates(fromCurrency, [toCurrency]);
    const rate = exchangeRates[toCurrency];
    
    if (!rate) {
      throw new Error('Failed to get exchange rate');
    }
    
    // Calculate converted amount
    const convertedAmount = amount * rate;
    
    // Calculate fee (0.5% in this example)
    const fee = amount * 0.005;
    const totalDeduction = amount + fee;
    
    // Check if user has enough to cover the fee
    if (sourceWallet.balance < totalDeduction) {
      throw new Error('Insufficient funds to cover conversion fee');
    }
    
    // Create transaction for source wallet
    const sourceTransaction = await this.prisma.currencyTransaction.create({
      data: {
        walletId: sourceWallet.id,
        amount,
        type: 'TRANSFER',
        status: 'COMPLETED',
        reference: `conv-${uuidv4()}`,
        description: `Convert ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`,
        fromCurrency,
        toCurrency,
        exchangeRate: rate,
        fee
      }
    });
    
    // Create transaction for destination wallet
    const destTransaction = await this.prisma.currencyTransaction.create({
      data: {
        walletId: destWallet.id,
        amount: convertedAmount,
        type: 'TRANSFER',
        status: 'COMPLETED',
        reference: `conv-${uuidv4()}`,
        description: `Received ${convertedAmount.toFixed(2)} ${toCurrency} from ${amount} ${fromCurrency}`,
        fromCurrency,
        toCurrency,
        exchangeRate: rate,
        fee: 0
      }
    });
    
    // Update source wallet balance
    await this.prisma.currencyWallet.update({
      where: { id: sourceWallet.id },
      data: {
        balance: {
          decrement: totalDeduction
        }
      }
    });
    
    // Update destination wallet balance
    await this.prisma.currencyWallet.update({
      where: { id: destWallet.id },
      data: {
        balance: {
          increment: convertedAmount
        }
      }
    });
    
    // Record exchange rate in history
    await this.prisma.exchangeRate.create({
      data: {
        fromCurrency,
        toCurrency,
        rate,
        source: 'api'
      }
    });
    
    return {
      message: 'Currency conversion completed',
      sourceTransaction,
      destinationTransaction: destTransaction,
      converted: {
        from: {
          currency: fromCurrency,
          amount
        },
        to: {
          currency: toCurrency,
          amount: convertedAmount
        },
        rate,
        fee
      }
    };
  }

  /**
   * Get transaction history for currency wallets
   */
  async getTransactions(userId: string, params: any) {
    const { currency, limit = 10, offset = 0, type, status } = params;
    
    // Find wallet(s)
    let wallets;
    
    if (currency) {
      const wallet = await this.prisma.currencyWallet.findUnique({
        where: {
          userId_currency: {
            userId,
            currency
          }
        }
      });
      
      if (!wallet) {
        return {
          transactions: [],
          totalCount: 0
        };
      }
      
      wallets = [wallet];
    } else {
      wallets = await this.prisma.currencyWallet.findMany({
        where: { userId }
      });
    }
    
    if (wallets.length === 0) {
      return {
        transactions: [],
        totalCount: 0
      };
    }
    
    // Build query
    const walletIds = wallets.map(w => w.id);
    
    const where: any = {
      walletId: {
        in: walletIds
      }
    };
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }
    
    // Get transactions
    const transactions = await this.prisma.currencyTransaction.findMany({
      where,
      include: {
        wallet: true,
        paymentMethod: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: Number(offset),
      take: Number(limit)
    });
    
    const totalCount = await this.prisma.currencyTransaction.count({ where });
    
    return {
      transactions,
      totalCount
    };
  }

  /**
   * Get exchange rates for currencies
   */
  private async getExchangeRates(baseCurrency: string, targetCurrencies: string[]): Promise<Record<string, number>> {
    // In a real application, you would call an exchange rate API
    // For demo purposes, we'll use mock data
    const mockRates = {
      USD: {
        EUR: 0.92,
        GBP: 0.78,
        JPY: 149.50,
        CAD: 1.35,
        AUD: 1.48,
        CHF: 0.89,
        CNY: 7.25,
        HKD: 7.82,
        SGD: 1.34,
        INR: 83.40
      },
      EUR: {
        USD: 1.09,
        GBP: 0.85,
        JPY: 162.50,
        CAD: 1.47,
        AUD: 1.61,
        CHF: 0.97,
        CNY: 7.88,
        HKD: 8.50,
        SGD: 1.45,
        INR: 90.80
      },
      GBP: {
        USD: 1.28,
        EUR: 1.18,
        JPY: 191.80,
        CAD: 1.73,
        AUD: 1.90,
        CHF: 1.14,
        CNY: 9.30,
        HKD: 10.02,
        SGD: 1.71,
        INR: 107.00
      }
      // Add more currencies as needed
    };
    
    // Check if base currency is in our mock data
    if (!mockRates[baseCurrency]) {
      // For unsupported base currencies, use USD as intermediate and calculate cross rates
      if (baseCurrency !== 'USD') {
        const usdToBase = 1 / mockRates.USD[baseCurrency];
        const result: Record<string, number> = {};
        
        targetCurrencies.forEach(currency => {
          if (currency === baseCurrency) {
            result[currency] = 1;
          } else if (mockRates.USD[currency]) {
            result[currency] = mockRates.USD[currency] * usdToBase;
          } else {
            result[currency] = 1; // Default to 1:1 for unsupported currencies
          }
        });
        
        return result;
      }
      
      // If base is not supported and not USD, return 1:1 rates
      return targetCurrencies.reduce((acc, curr) => {
        acc[curr] = 1;
        return acc;
      }, {});
    }
    
    // Base currency is supported in our mock data
    const baseRates = mockRates[baseCurrency];
    const result: Record<string, number> = {};
    
    targetCurrencies.forEach(currency => {
      if (currency === baseCurrency) {
        result[currency] = 1;
      } else if (baseRates[currency]) {
        result[currency] = baseRates[currency];
      } else if (currency === 'USD' && baseCurrency !== 'USD') {
        // If target is USD and not already handled
        result.USD = 1 / mockRates.USD[baseCurrency];
      } else if (mockRates.USD[currency]) {
        // Use USD as intermediate
        const baseToUsd = baseCurrency === 'USD' ? 1 : (1 / mockRates.USD[baseCurrency]);
        result[currency] = mockRates.USD[currency] * baseToUsd;
      } else {
        result[currency] = 1; // Default to 1:1 for unsupported currencies
      }
    });
    
    return result;
  }

  /**
   * Validate currency code
   */
  private isValidCurrencyCode(code: string): boolean {
    // List of supported currency codes
    const supportedCurrencies = [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'HKD', 'SGD', 'INR',
      'NZD', 'SEK', 'NOK', 'DKK', 'ZAR', 'BRL', 'MXN', 'AED', 'SAR', 'RUB', 'TRY'
    ];
    
    return supportedCurrencies.includes(code);
  }
}
