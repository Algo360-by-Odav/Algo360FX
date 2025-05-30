import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a monthly financial report for a user
   */
  async generateMonthlyReport(userId: string, year: number, month: number) {
    // Find user's wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Get all transactions for the month
    const transactions = await this.prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Get starting balance (balance at the end of previous month)
    const previousMonthEnd = new Date(year, month - 1, 0);
    const previousMonthTransactions = await this.prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        createdAt: {
          lt: startDate
        },
        status: 'COMPLETED'
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Calculate starting balance based on previous transactions
    let startingBalance = 0;
    previousMonthTransactions.forEach(tx => {
      if (tx.type === 'DEPOSIT') {
        startingBalance += tx.amount;
      } else if (tx.type === 'WITHDRAWAL' || tx.type === 'FEE') {
        startingBalance -= tx.amount;
      } else if (tx.type === 'TRANSFER') {
        // For transfers, check if it's incoming or outgoing
        if (tx.description.includes('to')) {
          startingBalance -= tx.amount;
        } else {
          startingBalance += tx.amount;
        }
      }
    });
    
    // Calculate totals by category
    const totals = {
      deposits: 0,
      withdrawals: 0,
      fees: 0,
      transfers: {
        incoming: 0,
        outgoing: 0
      }
    };
    
    transactions.forEach(tx => {
      if (tx.status !== 'COMPLETED') return;
      
      if (tx.type === 'DEPOSIT') {
        totals.deposits += tx.amount;
      } else if (tx.type === 'WITHDRAWAL') {
        totals.withdrawals += tx.amount;
      } else if (tx.type === 'FEE') {
        totals.fees += tx.amount;
      } else if (tx.type === 'TRANSFER') {
        if (tx.description.includes('to')) {
          totals.transfers.outgoing += tx.amount;
        } else {
          totals.transfers.incoming += tx.amount;
        }
      }
    });
    
    // Calculate ending balance
    const endingBalance = startingBalance + 
      totals.deposits - totals.withdrawals - totals.fees + 
      totals.transfers.incoming - totals.transfers.outgoing;
    
    // Calculate transaction counts by type
    const transactionCounts = {
      deposits: transactions.filter(tx => tx.type === 'DEPOSIT').length,
      withdrawals: transactions.filter(tx => tx.type === 'WITHDRAWAL').length,
      transfers: transactions.filter(tx => tx.type === 'TRANSFER').length,
      fees: transactions.filter(tx => tx.type === 'FEE').length,
      total: transactions.length
    };
    
    // Calculate transaction counts by status
    const statusCounts = {
      completed: transactions.filter(tx => tx.status === 'COMPLETED').length,
      pending: transactions.filter(tx => tx.status === 'PENDING').length,
      failed: transactions.filter(tx => tx.status === 'FAILED').length,
      cancelled: transactions.filter(tx => tx.status === 'CANCELLED').length
    };
    
    // Format the report
    return {
      reportType: 'monthly',
      userId,
      walletId: wallet.id,
      currency: wallet.currency,
      period: {
        year,
        month,
        startDate,
        endDate
      },
      balances: {
        starting: startingBalance,
        ending: endingBalance,
        net: endingBalance - startingBalance
      },
      totals,
      transactionCounts,
      statusCounts,
      transactions
    };
  }

  /**
   * Generate a yearly financial report for a user
   */
  async generateYearlyReport(userId: string, year: number) {
    // Find user's wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Calculate date range for the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    
    // Get all transactions for the year
    const transactions = await this.prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Generate monthly breakdowns
    const monthlyBreakdown = [];
    
    for (let month = 1; month <= 12; month++) {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      
      const monthTransactions = transactions.filter(tx => 
        tx.createdAt >= monthStart && tx.createdAt <= monthEnd
      );
      
      const monthTotals = {
        deposits: 0,
        withdrawals: 0,
        fees: 0,
        transfers: {
          incoming: 0,
          outgoing: 0
        }
      };
      
      monthTransactions.forEach(tx => {
        if (tx.status !== 'COMPLETED') return;
        
        if (tx.type === 'DEPOSIT') {
          monthTotals.deposits += tx.amount;
        } else if (tx.type === 'WITHDRAWAL') {
          monthTotals.withdrawals += tx.amount;
        } else if (tx.type === 'FEE') {
          monthTotals.fees += tx.amount;
        } else if (tx.type === 'TRANSFER') {
          if (tx.description.includes('to')) {
            monthTotals.transfers.outgoing += tx.amount;
          } else {
            monthTotals.transfers.incoming += tx.amount;
          }
        }
      });
      
      const netFlow = monthTotals.deposits - 
        monthTotals.withdrawals - 
        monthTotals.fees + 
        monthTotals.transfers.incoming - 
        monthTotals.transfers.outgoing;
      
      monthlyBreakdown.push({
        year,
        month,
        transactionCount: monthTransactions.length,
        totals: monthTotals,
        netFlow
      });
    }
    
    // Calculate yearly totals
    const yearlyTotals = {
      deposits: 0,
      withdrawals: 0,
      fees: 0,
      transfers: {
        incoming: 0,
        outgoing: 0
      }
    };
    
    transactions.forEach(tx => {
      if (tx.status !== 'COMPLETED') return;
      
      if (tx.type === 'DEPOSIT') {
        yearlyTotals.deposits += tx.amount;
      } else if (tx.type === 'WITHDRAWAL') {
        yearlyTotals.withdrawals += tx.amount;
      } else if (tx.type === 'FEE') {
        yearlyTotals.fees += tx.amount;
      } else if (tx.type === 'TRANSFER') {
        if (tx.description.includes('to')) {
          yearlyTotals.transfers.outgoing += tx.amount;
        } else {
          yearlyTotals.transfers.incoming += tx.amount;
        }
      }
    });
    
    // Calculate net flow for the year
    const yearlyNetFlow = yearlyTotals.deposits - 
      yearlyTotals.withdrawals - 
      yearlyTotals.fees + 
      yearlyTotals.transfers.incoming - 
      yearlyTotals.transfers.outgoing;
    
    // Format the report
    return {
      reportType: 'yearly',
      userId,
      walletId: wallet.id,
      currency: wallet.currency,
      year,
      period: {
        startDate,
        endDate
      },
      totals: yearlyTotals,
      netFlow: yearlyNetFlow,
      transactionCount: transactions.length,
      monthlyBreakdown
    };
  }

  /**
   * Get a statistical analysis of a user's wallet activity
   */
  async getWalletAnalytics(userId: string, startDate?: Date, endDate?: Date) {
    // Find user's wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    // Build query for transactions
    const where: any = {
      walletId: wallet.id,
      status: 'COMPLETED'
    };
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    } else if (startDate) {
      where.createdAt = {
        gte: startDate
      };
    } else if (endDate) {
      where.createdAt = {
        lte: endDate
      };
    }
    
    // Get transactions
    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    if (transactions.length === 0) {
      return {
        message: 'No completed transactions found in the specified period'
      };
    }
    
    // Calculate transaction metrics
    const transactionsByType = {
      DEPOSIT: transactions.filter(tx => tx.type === 'DEPOSIT'),
      WITHDRAWAL: transactions.filter(tx => tx.type === 'WITHDRAWAL'),
      TRANSFER: transactions.filter(tx => tx.type === 'TRANSFER'),
      FEE: transactions.filter(tx => tx.type === 'FEE')
    };
    
    // Calculate average transaction amounts
    const averageAmounts = {
      deposits: transactionsByType.DEPOSIT.length > 0 
        ? transactionsByType.DEPOSIT.reduce((sum, tx) => sum + tx.amount, 0) / transactionsByType.DEPOSIT.length 
        : 0,
      withdrawals: transactionsByType.WITHDRAWAL.length > 0 
        ? transactionsByType.WITHDRAWAL.reduce((sum, tx) => sum + tx.amount, 0) / transactionsByType.WITHDRAWAL.length 
        : 0,
      transfers: transactionsByType.TRANSFER.length > 0 
        ? transactionsByType.TRANSFER.reduce((sum, tx) => sum + tx.amount, 0) / transactionsByType.TRANSFER.length 
        : 0,
      fees: transactionsByType.FEE.length > 0 
        ? transactionsByType.FEE.reduce((sum, tx) => sum + tx.amount, 0) / transactionsByType.FEE.length 
        : 0
    };
    
    // Find largest transactions
    const largestTransactions = {
      deposit: transactionsByType.DEPOSIT.length > 0 
        ? transactionsByType.DEPOSIT.reduce((max, tx) => tx.amount > max.amount ? tx : max, transactionsByType.DEPOSIT[0]) 
        : null,
      withdrawal: transactionsByType.WITHDRAWAL.length > 0 
        ? transactionsByType.WITHDRAWAL.reduce((max, tx) => tx.amount > max.amount ? tx : max, transactionsByType.WITHDRAWAL[0]) 
        : null
    };
    
    // Calculate frequency metrics
    const firstTx = transactions[0];
    const lastTx = transactions[transactions.length - 1];
    const daysBetween = Math.ceil((lastTx.createdAt.getTime() - firstTx.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    const frequency = {
      totalDays: daysBetween,
      transactionsPerDay: daysBetween > 0 ? transactions.length / daysBetween : 0,
      depositsPerMonth: transactionsByType.DEPOSIT.length > 0 
        ? (transactionsByType.DEPOSIT.length / daysBetween) * 30 
        : 0,
      withdrawalsPerMonth: transactionsByType.WITHDRAWAL.length > 0 
        ? (transactionsByType.WITHDRAWAL.length / daysBetween) * 30 
        : 0
    };
    
    // Calculate balance growth
    let runningBalance = 0;
    const balanceHistory = transactions.map(tx => {
      if (tx.type === 'DEPOSIT') {
        runningBalance += tx.amount;
      } else if (tx.type === 'WITHDRAWAL' || tx.type === 'FEE') {
        runningBalance -= tx.amount;
      } else if (tx.type === 'TRANSFER') {
        if (tx.description.includes('to')) {
          runningBalance -= tx.amount;
        } else {
          runningBalance += tx.amount;
        }
      }
      
      return {
        date: tx.createdAt,
        balance: runningBalance,
        transaction: tx
      };
    });
    
    // Calculate growth metrics
    const growth = {
      startingBalance: 0,
      endingBalance: runningBalance,
      netGrowth: runningBalance,
      percentageGrowth: 0, // Will be calculated below if possible
      dailyGrowthRate: daysBetween > 0 ? runningBalance / daysBetween : 0
    };
    
    // Return analytics
    return {
      walletId: wallet.id,
      currency: wallet.currency,
      period: {
        start: firstTx.createdAt,
        end: lastTx.createdAt,
        days: daysBetween
      },
      transactionCounts: {
        total: transactions.length,
        deposits: transactionsByType.DEPOSIT.length,
        withdrawals: transactionsByType.WITHDRAWAL.length,
        transfers: transactionsByType.TRANSFER.length,
        fees: transactionsByType.FEE.length
      },
      totals: {
        deposits: transactionsByType.DEPOSIT.reduce((sum, tx) => sum + tx.amount, 0),
        withdrawals: transactionsByType.WITHDRAWAL.reduce((sum, tx) => sum + tx.amount, 0),
        transfers: transactionsByType.TRANSFER.reduce((sum, tx) => sum + tx.amount, 0),
        fees: transactionsByType.FEE.reduce((sum, tx) => sum + tx.amount, 0)
      },
      averageAmounts,
      largestTransactions,
      frequency,
      growth,
      balanceHistory: balanceHistory.map(bh => ({
        date: bh.date,
        balance: bh.balance
      }))
    };
  }
}
