import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class CryptoService {
  private cryptoApiKey: string;
  
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // In production, you would use a proper crypto API service like CoinGecko, Binance, etc.
    this.cryptoApiKey = this.configService.get('CRYPTO_API_KEY') || 'demo-api-key';
  }

  /**
   * Get all crypto wallets for a user
   */
  async getCryptoWallets(userId: string) {
    const wallets = await this.prisma.cryptoWallet.findMany({
      where: { userId }
    });
    
    // Fetch current prices for each crypto type
    const walletTypes = wallets.map(wallet => wallet.cryptoType);
    const prices = await this.getCurrentPrices(walletTypes);
    
    // Calculate USD value for each wallet
    const walletsWithValues = wallets.map(wallet => {
      const price = prices[wallet.cryptoType] || 0;
      const valueUSD = wallet.balance * price;
      
      return {
        ...wallet,
        currentPrice: price,
        valueUSD
      };
    });
    
    return walletsWithValues;
  }

  /**
   * Get a specific crypto wallet
   */
  async getCryptoWallet(userId: string, cryptoType: string) {
    const wallet = await this.prisma.cryptoWallet.findUnique({
      where: {
        userId_cryptoType: {
          userId,
          cryptoType
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
    
    const prices = await this.getCurrentPrices([wallet.cryptoType]);
    const price = prices[wallet.cryptoType] || 0;
    
    return {
      ...wallet,
      currentPrice: price,
      valueUSD: wallet.balance * price
    };
  }

  /**
   * Create a new crypto wallet for a user
   */
  async createCryptoWallet(userId: string, cryptoType: string) {
    // Check if wallet already exists
    const existingWallet = await this.prisma.cryptoWallet.findUnique({
      where: {
        userId_cryptoType: {
          userId,
          cryptoType
        }
      }
    });
    
    if (existingWallet) {
      return existingWallet;
    }
    
    // Generate a mock address - in production you would integrate with a real wallet provider
    const address = this.generateMockAddress(cryptoType);
    
    // Create wallet
    return this.prisma.cryptoWallet.create({
      data: {
        userId,
        cryptoType,
        address,
        balance: 0,
        pendingBalance: 0
      }
    });
  }

  /**
   * Deposit crypto to a wallet
   */
  async depositCrypto(userId: string, data: { cryptoType: string, amount: number, fromAddress?: string }) {
    const { cryptoType, amount, fromAddress } = data;
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    // Get or create wallet
    let wallet = await this.prisma.cryptoWallet.findUnique({
      where: {
        userId_cryptoType: {
          userId,
          cryptoType
        }
      }
    });
    
    if (!wallet) {
      wallet = await this.createCryptoWallet(userId, cryptoType);
    }
    
    // Create a mock transaction hash
    const hash = `0x${crypto.randomBytes(32).toString('hex')}`;
    
    // Create transaction
    const transaction = await this.prisma.cryptoTransaction.create({
      data: {
        cryptoWalletId: wallet.id,
        amount,
        type: 'DEPOSIT',
        status: 'PENDING',
        hash,
        fromAddress: fromAddress || 'external-address',
        toAddress: wallet.address,
        fee: this.calculateNetworkFee(cryptoType),
        confirmations: 0,
        description: `Deposit ${amount} ${cryptoType}`
      }
    });
    
    // In a real implementation, you would listen for blockchain confirmations
    // For demo purposes, we'll simulate confirmations and complete the transaction
    this.simulateConfirmations(transaction.id, wallet.id, amount);
    
    return {
      message: 'Deposit initiated',
      transaction
    };
  }

  /**
   * Withdraw crypto from a wallet
   */
  async withdrawCrypto(userId: string, data: { cryptoType: string, amount: number, toAddress: string }) {
    const { cryptoType, amount, toAddress } = data;
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    if (!toAddress) {
      throw new Error('Destination address is required');
    }
    
    // Get wallet
    const wallet = await this.prisma.cryptoWallet.findUnique({
      where: {
        userId_cryptoType: {
          userId,
          cryptoType
        }
      }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Calculate network fee
    const fee = this.calculateNetworkFee(cryptoType);
    const totalAmount = amount + fee;
    
    // Check sufficient balance
    if (wallet.balance < totalAmount) {
      throw new Error('Insufficient balance');
    }
    
    // Create a mock transaction hash
    const hash = `0x${crypto.randomBytes(32).toString('hex')}`;
    
    // Create transaction
    const transaction = await this.prisma.cryptoTransaction.create({
      data: {
        cryptoWalletId: wallet.id,
        amount,
        type: 'WITHDRAWAL',
        status: 'PENDING',
        hash,
        fromAddress: wallet.address,
        toAddress,
        fee,
        confirmations: 0,
        description: `Withdraw ${amount} ${cryptoType}`
      }
    });
    
    // Update wallet with pending withdrawal
    await this.prisma.cryptoWallet.update({
      where: {
        id: wallet.id
      },
      data: {
        balance: {
          decrement: totalAmount
        },
        pendingBalance: {
          increment: totalAmount
        }
      }
    });
    
    // In a real implementation, you would submit to the blockchain and wait for confirmations
    // For demo purposes, we'll simulate blockchain confirmations
    this.simulateWithdrawalConfirmations(transaction.id, wallet.id, totalAmount);
    
    return {
      message: 'Withdrawal initiated',
      transaction
    };
  }

  /**
   * Transfer crypto between wallets
   */
  async transferCrypto(userId: string, data: { 
    fromCryptoType: string, 
    toCryptoType: string, 
    amount: number 
  }) {
    const { fromCryptoType, toCryptoType, amount } = data;
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    // Get source wallet
    const sourceWallet = await this.prisma.cryptoWallet.findUnique({
      where: {
        userId_cryptoType: {
          userId,
          cryptoType: fromCryptoType
        }
      }
    });
    
    if (!sourceWallet) {
      throw new Error('Source wallet not found');
    }
    
    // Check sufficient balance
    if (sourceWallet.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Get or create destination wallet
    let destWallet = await this.prisma.cryptoWallet.findUnique({
      where: {
        userId_cryptoType: {
          userId,
          cryptoType: toCryptoType
        }
      }
    });
    
    if (!destWallet) {
      destWallet = await this.createCryptoWallet(userId, toCryptoType);
    }
    
    // If same currency, do a simple transfer
    if (fromCryptoType === toCryptoType) {
      const hash = `0x${crypto.randomBytes(32).toString('hex')}`;
      
      // Create transaction
      const transaction = await this.prisma.cryptoTransaction.create({
        data: {
          cryptoWalletId: sourceWallet.id,
          amount,
          type: 'TRANSFER',
          status: 'COMPLETED',
          hash,
          fromAddress: sourceWallet.address,
          toAddress: destWallet.address,
          fee: 0,
          confirmations: 1,
          description: `Transfer ${amount} ${fromCryptoType}`
        }
      });
      
      // Update wallets
      await this.prisma.cryptoWallet.update({
        where: { id: sourceWallet.id },
        data: { balance: { decrement: amount } }
      });
      
      await this.prisma.cryptoWallet.update({
        where: { id: destWallet.id },
        data: { balance: { increment: amount } }
      });
      
      return {
        message: 'Transfer completed',
        transaction
      };
    } else {
      // Different currencies - need to do a swap
      // Get current exchange rates
      const prices = await this.getCurrentPrices([fromCryptoType, toCryptoType]);
      const sourcePrice = prices[fromCryptoType] || 0;
      const destPrice = prices[toCryptoType] || 0;
      
      if (sourcePrice === 0 || destPrice === 0) {
        throw new Error('Unable to get exchange rates');
      }
      
      // Calculate conversion
      const sourceValueUSD = amount * sourcePrice;
      const destAmount = sourceValueUSD / destPrice;
      
      // Create swap transaction
      const hash = `0x${crypto.randomBytes(32).toString('hex')}`;
      
      const transaction = await this.prisma.cryptoTransaction.create({
        data: {
          cryptoWalletId: sourceWallet.id,
          amount,
          type: 'SWAP',
          status: 'COMPLETED',
          hash,
          fromAddress: sourceWallet.address,
          toAddress: destWallet.address,
          fee: this.calculateNetworkFee(fromCryptoType),
          confirmations: 1,
          description: `Swap ${amount} ${fromCryptoType} for ${destAmount.toFixed(8)} ${toCryptoType}`
        }
      });
      
      // Update wallets
      await this.prisma.cryptoWallet.update({
        where: { id: sourceWallet.id },
        data: { balance: { decrement: amount } }
      });
      
      await this.prisma.cryptoWallet.update({
        where: { id: destWallet.id },
        data: { balance: { increment: destAmount } }
      });
      
      return {
        message: 'Swap completed',
        transaction,
        exchangeRate: {
          from: sourcePrice,
          to: destPrice,
          rate: destPrice / sourcePrice,
          amountReceived: destAmount
        }
      };
    }
  }

  /**
   * Get crypto transaction history
   */
  async getCryptoTransactions(userId: string, params: any) {
    const { cryptoType, limit = 10, offset = 0, type, status } = params;
    
    // Find wallet(s)
    let wallets;
    
    if (cryptoType) {
      const wallet = await this.prisma.cryptoWallet.findUnique({
        where: {
          userId_cryptoType: {
            userId,
            cryptoType
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
      wallets = await this.prisma.cryptoWallet.findMany({
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
      cryptoWalletId: {
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
    const transactions = await this.prisma.cryptoTransaction.findMany({
      where,
      include: {
        cryptoWallet: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: Number(offset),
      take: Number(limit)
    });
    
    const totalCount = await this.prisma.cryptoTransaction.count({ where });
    
    return {
      transactions,
      totalCount
    };
  }

  /**
   * Get current crypto prices
   */
  private async getCurrentPrices(cryptoTypes: string[]): Promise<Record<string, number>> {
    // In a real application, you would call a crypto price API
    // For demo purposes, we'll use mock data
    const mockPrices = {
      BTC: 65000,
      ETH: 3500,
      USDT: 1,
      BNB: 450,
      SOL: 150,
      ADA: 0.5,
      XRP: 0.6,
      DOT: 12,
      DOGE: 0.15,
      AVAX: 35
    };
    
    // In a real app, you would save these prices to the CryptoPriceHistory table
    // to maintain historical price data
    
    // Return prices for requested crypto types
    const result: Record<string, number> = {};
    
    cryptoTypes.forEach(type => {
      result[type] = mockPrices[type] || 0;
    });
    
    return result;
  }

  /**
   * Generate a mock address for the given crypto type
   */
  private generateMockAddress(cryptoType: string): string {
    switch (cryptoType) {
      case 'BTC':
        return `bc1${crypto.randomBytes(20).toString('hex')}`;
      case 'ETH':
      case 'USDT':
      case 'BNB':
        return `0x${crypto.randomBytes(20).toString('hex')}`;
      case 'SOL':
        return crypto.randomBytes(32).toString('base64').substring(0, 44);
      case 'ADA':
        return `addr1${crypto.randomBytes(25).toString('hex')}`;
      case 'XRP':
        return `r${crypto.randomBytes(20).toString('hex')}`;
      default:
        return `wallet_${cryptoType.toLowerCase()}_${crypto.randomBytes(10).toString('hex')}`;
    }
  }

  /**
   * Calculate mock network fee based on crypto type
   */
  private calculateNetworkFee(cryptoType: string): number {
    switch (cryptoType) {
      case 'BTC':
        return 0.0001;
      case 'ETH':
        return 0.003;
      case 'USDT':
        return 10;
      case 'BNB':
        return 0.0005;
      case 'SOL':
        return 0.00001;
      case 'ADA':
        return 0.17;
      case 'XRP':
        return 0.0002;
      case 'DOT':
        return 0.01;
      case 'DOGE':
        return 1;
      case 'AVAX':
        return 0.001;
      default:
        return 0.001;
    }
  }

  /**
   * Simulate blockchain confirmations
   */
  private simulateConfirmations(transactionId: string, walletId: string, amount: number) {
    // In a real application, you would listen for blockchain events
    // For demo purposes, we'll simulate confirmations after a delay
    
    setTimeout(async () => {
      try {
        // Update transaction to 1 confirmation
        await this.prisma.cryptoTransaction.update({
          where: { id: transactionId },
          data: {
            confirmations: 1
          }
        });
        
        // After more time, finalize the transaction
        setTimeout(async () => {
          try {
            // Update transaction to completed with 6 confirmations
            await this.prisma.cryptoTransaction.update({
              where: { id: transactionId },
              data: {
                status: 'COMPLETED',
                confirmations: 6
              }
            });
            
            // Update wallet balance
            await this.prisma.cryptoWallet.update({
              where: { id: walletId },
              data: {
                balance: {
                  increment: amount
                }
              }
            });
          } catch (error) {
            console.error('Error finalizing crypto transaction:', error);
          }
        }, 10000); // 10 seconds
      } catch (error) {
        console.error('Error updating crypto transaction confirmations:', error);
      }
    }, 5000); // 5 seconds
  }

  /**
   * Simulate withdrawal confirmations
   */
  private simulateWithdrawalConfirmations(transactionId: string, walletId: string, totalAmount: number) {
    // In a real application, you would submit to the blockchain and wait for confirmations
    // For demo purposes, we'll simulate this process
    
    setTimeout(async () => {
      try {
        // Update transaction to 1 confirmation
        await this.prisma.cryptoTransaction.update({
          where: { id: transactionId },
          data: {
            confirmations: 1
          }
        });
        
        // After more time, finalize the transaction
        setTimeout(async () => {
          try {
            // Update transaction to completed with 6 confirmations
            await this.prisma.cryptoTransaction.update({
              where: { id: transactionId },
              data: {
                status: 'COMPLETED',
                confirmations: 6
              }
            });
            
            // Update wallet - remove from pending balance
            await this.prisma.cryptoWallet.update({
              where: { id: walletId },
              data: {
                pendingBalance: {
                  decrement: totalAmount
                }
              }
            });
          } catch (error) {
            console.error('Error finalizing crypto withdrawal:', error);
          }
        }, 10000); // 10 seconds
      } catch (error) {
        console.error('Error updating crypto withdrawal confirmations:', error);
      }
    }, 5000); // 5 seconds
  }
}
