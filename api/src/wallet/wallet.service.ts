import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get wallet balance for a user
   */
  async getWalletBalance(userId: string) {
    // Get wallet or create if it doesn't exist
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          currency: 'USD'
        }
      });
    }
    
    // Get pending deposits total
    const pendingDeposits = await this.prisma.transaction.aggregate({
      where: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        status: 'PENDING'
      },
      _sum: {
        amount: true
      }
    });
    
    // Calculate available balance (total minus pending)
    const pendingAmount = pendingDeposits._sum.amount || 0;
    const availableBalance = wallet.balance - pendingAmount;
    
    return {
      balance: wallet.balance,
      availableBalance,
      pendingDeposits: pendingAmount,
      currency: wallet.currency,
      lastUpdated: wallet.updatedAt
    };
  }

  /**
   * Get transaction history for a user
   */
  async getTransactions(userId: string, params: any) {
    const { limit = 10, offset = 0, type, startDate, endDate, status } = params;
    
    // Get user's wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      return {
        transactions: [],
        totalCount: 0,
        limit,
        offset
      };
    }
    
    // Build filter conditions
    const where: any = { walletId: wallet.id };
    
    if (type) {
      where.type = type.toUpperCase();
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      where.createdAt = {
        gte: new Date(startDate)
      };
    } else if (endDate) {
      where.createdAt = {
        lte: new Date(endDate)
      };
    }
    
    // Get transactions
    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit,
      include: {
        paymentMethod: {
          select: {
            name: true,
            last4: true,
            type: true
          }
        }
      }
    });
    
    // Get total count
    const totalCount = await this.prisma.transaction.count({ where });
    
    return {
      transactions,
      totalCount,
      limit,
      offset
    };
  }

  /**
   * Get payment methods for a user
   */
  async getPaymentMethods(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  /**
   * Add a new payment method for a user
   */
  async addPaymentMethod(userId: string, paymentMethodData: any) {
    const { type, name, last4, details } = paymentMethodData;
    
    // Check if this is the first payment method for the user
    const existingMethods = await this.prisma.paymentMethod.count({
      where: { userId }
    });
    
    // Create payment method
    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type,
        name,
        last4,
        details,
        isDefault: existingMethods === 0 // Make default if first method
      }
    });
  }

  /**
   * Remove a payment method
   */
  async removePaymentMethod(userId: string, paymentMethodId: string) {
    // Check if payment method exists and belongs to user
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });
    
    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new Error('Payment method not found');
    }
    
    // Check if payment method is default
    if (paymentMethod.isDefault) {
      // Find another payment method to make default
      const alternativeMethod = await this.prisma.paymentMethod.findFirst({
        where: {
          userId,
          id: { not: paymentMethodId }
        }
      });
      
      if (alternativeMethod) {
        await this.prisma.paymentMethod.update({
          where: { id: alternativeMethod.id },
          data: { isDefault: true }
        });
      }
    }
    
    // Remove payment method
    await this.prisma.paymentMethod.delete({
      where: { id: paymentMethodId }
    });
    
    return { message: 'Payment method removed successfully' };
  }

  /**
   * Set payment method as default
   */
  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    // Check if payment method exists and belongs to user
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });
    
    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new Error('Payment method not found');
    }
    
    // Clear default from all payment methods for this user
    await this.prisma.paymentMethod.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
    
    // Set new default
    return this.prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true }
    });
  }

  /**
   * Process a deposit
   */
  async deposit(userId: string, depositData: any) {
    const { amount, paymentMethodId } = depositData;
    
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
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
    
    // Get user's wallet or create if it doesn't exist
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          currency: 'USD'
        }
      });
    }
    
    // Create transaction (pending status initially)
    const transaction = await this.prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount: parseFloat(amount.toString()),
        type: 'DEPOSIT',
        status: 'PENDING',
        description: 'Deposit via ' + (paymentMethodId ? 'payment method' : 'manual'),
        reference: `dep-${uuidv4()}`,
        paymentMethodId
      }
    });
    
    // In a real application, you would integrate with a payment processor here
    // For demo purposes, we'll simulate successful payment processing
    
    // Update transaction status after payment processing
    setTimeout(async () => {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' }
      });
      
      // Update wallet balance
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: parseFloat(amount.toString())
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
   * Process a withdrawal
   */
  async withdraw(userId: string, withdrawData: any) {
    const { amount, paymentMethodId } = withdrawData;
    
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    
    if (!paymentMethodId) {
      throw new Error('Payment method is required');
    }
    
    // Check if payment method exists and belongs to user
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });
    
    if (!paymentMethod || paymentMethod.userId !== userId) {
      throw new Error('Payment method not found');
    }
    
    // Get user's wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Get pending deposits total
    const pendingDeposits = await this.prisma.transaction.aggregate({
      where: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        status: 'PENDING'
      },
      _sum: {
        amount: true
      }
    });
    
    const pendingAmount = pendingDeposits._sum.amount || 0;
    const availableBalance = wallet.balance - pendingAmount;
    
    // Check if user has sufficient funds
    if (availableBalance < parseFloat(amount.toString())) {
      throw new Error('Insufficient funds');
    }
    
    // Create transaction (pending status initially)
    const transaction = await this.prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount: parseFloat(amount.toString()),
        type: 'WITHDRAWAL',
        status: 'PENDING',
        description: `Withdrawal to ${paymentMethod.name} (${paymentMethod.last4})`,
        reference: `wit-${uuidv4()}`,
        paymentMethodId
      }
    });
    
    // In a real application, you would integrate with a payment processor here
    // For demo purposes, we'll simulate successful withdrawal processing
    
    // Update transaction status after processing
    setTimeout(async () => {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' }
      });
      
      // Update wallet balance
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            decrement: parseFloat(amount.toString())
          }
        }
      });
    }, 5000); // Simulate 5-second processing time
    
    return {
      message: 'Withdrawal initiated successfully',
      transaction
    };
  }

  /**
   * Transfer funds between accounts
   */
  async transfer(userId: string, transferData: any) {
    const { amount, destinationAccount } = transferData;
    
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }
    
    if (!destinationAccount) {
      throw new Error('Destination account is required');
    }
    
    // Get user's wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Check if user has sufficient funds
    if (wallet.balance < parseFloat(amount.toString())) {
      throw new Error('Insufficient funds');
    }
    
    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount: parseFloat(amount.toString()),
        type: 'TRANSFER',
        status: 'COMPLETED',
        description: `Transfer to ${destinationAccount}`,
        reference: `tra-${uuidv4()}`
      }
    });
    
    // Update wallet balance
    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          decrement: parseFloat(amount.toString())
        }
      }
    });
    
    return {
      message: 'Transfer completed successfully',
      transaction
    };
  }

  /**
   * Get wallet statements
   */
  async getStatements(userId: string, params: any) {
    const { month, year } = params;
    
    if (!month || !year) {
      throw new Error('Month and year are required');
    }
    
    // Get user's wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Calculate date range for the requested month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Get transactions for the month
    const transactions = await this.prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        paymentMethod: {
          select: {
            name: true,
            last4: true,
            type: true
          }
        }
      }
    });
    
    // Calculate totals
    const totals = {
      deposits: 0,
      withdrawals: 0,
      fees: 0,
      transfers: 0
    };
    
    transactions.forEach(transaction => {
      switch (transaction.type) {
        case 'DEPOSIT':
          totals.deposits += transaction.amount;
          break;
        case 'WITHDRAWAL':
          totals.withdrawals += transaction.amount;
          break;
        case 'FEE':
          totals.fees += transaction.amount;
          break;
        case 'TRANSFER':
          totals.transfers += transaction.amount;
          break;
      }
    });
    
    // Format statement data
    return {
      month,
      year,
      transactions,
      totals,
      openingBalance: 0, // Would need to calculate this from previous month
      closingBalance: wallet.balance,
      currency: wallet.currency
    };
  }
}
