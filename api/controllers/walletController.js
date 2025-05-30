const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

/**
 * Wallet Controller
 * Handles all wallet-related operations
 */
const walletController = {
  /**
   * Get wallet balance for authenticated user
   */
  getWalletBalance: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Get wallet or create if it doesn't exist
      let wallet = await prisma.wallet.findUnique({
        where: { userId }
      });
      
      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId,
            balance: 0,
            currency: 'USD'
          }
        });
      }
      
      // Get pending deposits total
      const pendingDeposits = await prisma.transaction.aggregate({
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
      
      return res.status(200).json({
        balance: wallet.balance,
        availableBalance,
        pendingDeposits: pendingAmount,
        currency: wallet.currency,
        lastUpdated: wallet.updatedAt
      });
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return res.status(500).json({ error: 'Failed to get wallet balance' });
    }
  },
  
  /**
   * Get transaction history for authenticated user
   */
  getTransactions: async (req, res) => {
    try {
      const userId = req.user.id;
      const { limit = 10, offset = 0, type, startDate, endDate, status } = req.query;
      
      // Get user's wallet
      const wallet = await prisma.wallet.findUnique({
        where: { userId }
      });
      
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      
      // Build filter conditions
      const where = { walletId: wallet.id };
      
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
      const transactions = await prisma.transaction.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip: parseInt(offset),
        take: parseInt(limit),
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
      const totalCount = await prisma.transaction.count({ where });
      
      return res.status(200).json({
        transactions,
        totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      return res.status(500).json({ error: 'Failed to get transactions' });
    }
  },
  
  /**
   * Get payment methods for authenticated user
   */
  getPaymentMethods: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const paymentMethods = await prisma.paymentMethod.findMany({
        where: { userId },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' }
        ]
      });
      
      return res.status(200).json(paymentMethods);
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return res.status(500).json({ error: 'Failed to get payment methods' });
    }
  },
  
  /**
   * Add a new payment method for authenticated user
   */
  addPaymentMethod: async (req, res) => {
    try {
      const userId = req.user.id;
      const { type, name, last4, details } = req.body;
      
      if (!type || !name || !last4) {
        return res.status(400).json({ error: 'Type, name, and last4 are required' });
      }
      
      // Check if this is the first payment method for the user
      const existingMethods = await prisma.paymentMethod.count({
        where: { userId }
      });
      
      // Create payment method
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          userId,
          type,
          name,
          last4,
          details,
          isDefault: existingMethods === 0 // Make default if first method
        }
      });
      
      return res.status(201).json(paymentMethod);
    } catch (error) {
      console.error('Error adding payment method:', error);
      return res.status(500).json({ error: 'Failed to add payment method' });
    }
  },
  
  /**
   * Remove a payment method
   */
  removePaymentMethod: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Check if payment method exists and belongs to user
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id }
      });
      
      if (!paymentMethod || paymentMethod.userId !== userId) {
        return res.status(404).json({ error: 'Payment method not found' });
      }
      
      // Check if payment method is default
      if (paymentMethod.isDefault) {
        // Find another payment method to make default
        const alternativeMethod = await prisma.paymentMethod.findFirst({
          where: {
            userId,
            id: { not: id }
          }
        });
        
        if (alternativeMethod) {
          await prisma.paymentMethod.update({
            where: { id: alternativeMethod.id },
            data: { isDefault: true }
          });
        }
      }
      
      // Remove payment method
      await prisma.paymentMethod.delete({
        where: { id }
      });
      
      return res.status(200).json({ message: 'Payment method removed successfully' });
    } catch (error) {
      console.error('Error removing payment method:', error);
      return res.status(500).json({ error: 'Failed to remove payment method' });
    }
  },
  
  /**
   * Set payment method as default
   */
  setDefaultPaymentMethod: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Check if payment method exists and belongs to user
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id }
      });
      
      if (!paymentMethod || paymentMethod.userId !== userId) {
        return res.status(404).json({ error: 'Payment method not found' });
      }
      
      // Clear default from all payment methods for this user
      await prisma.paymentMethod.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
      
      // Set new default
      const updatedMethod = await prisma.paymentMethod.update({
        where: { id },
        data: { isDefault: true }
      });
      
      return res.status(200).json(updatedMethod);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return res.status(500).json({ error: 'Failed to set default payment method' });
    }
  },
  
  /**
   * Process a deposit
   */
  deposit: async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount, paymentMethodId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      
      // Check if payment method exists and belongs to user
      if (paymentMethodId) {
        const paymentMethod = await prisma.paymentMethod.findUnique({
          where: { id: paymentMethodId }
        });
        
        if (!paymentMethod || paymentMethod.userId !== userId) {
          return res.status(404).json({ error: 'Payment method not found' });
        }
      }
      
      // Get user's wallet or create if it doesn't exist
      let wallet = await prisma.wallet.findUnique({
        where: { userId }
      });
      
      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId,
            balance: 0,
            currency: 'USD'
          }
        });
      }
      
      // Create transaction (pending status initially)
      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: parseFloat(amount),
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
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'COMPLETED' }
        });
        
        // Update wallet balance
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: {
              increment: parseFloat(amount)
            }
          }
        });
      }, 5000); // Simulate 5-second processing time
      
      return res.status(201).json({
        message: 'Deposit initiated successfully',
        transaction
      });
    } catch (error) {
      console.error('Error processing deposit:', error);
      return res.status(500).json({ error: 'Failed to process deposit' });
    }
  },
  
  /**
   * Process a withdrawal
   */
  withdraw: async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount, paymentMethodId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      
      if (!paymentMethodId) {
        return res.status(400).json({ error: 'Payment method is required' });
      }
      
      // Check if payment method exists and belongs to user
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId }
      });
      
      if (!paymentMethod || paymentMethod.userId !== userId) {
        return res.status(404).json({ error: 'Payment method not found' });
      }
      
      // Get user's wallet
      const wallet = await prisma.wallet.findUnique({
        where: { userId }
      });
      
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      
      // Get pending deposits total
      const pendingDeposits = await prisma.transaction.aggregate({
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
      if (availableBalance < parseFloat(amount)) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }
      
      // Create transaction (pending status initially)
      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: parseFloat(amount),
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
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'COMPLETED' }
        });
        
        // Update wallet balance
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: {
              decrement: parseFloat(amount)
            }
          }
        });
      }, 5000); // Simulate 5-second processing time
      
      return res.status(201).json({
        message: 'Withdrawal initiated successfully',
        transaction
      });
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return res.status(500).json({ error: 'Failed to process withdrawal' });
    }
  },
  
  /**
   * Transfer funds between accounts
   */
  transfer: async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount, destinationAccount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      
      if (!destinationAccount) {
        return res.status(400).json({ error: 'Destination account is required' });
      }
      
      // Get user's wallet
      const wallet = await prisma.wallet.findUnique({
        where: { userId }
      });
      
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      
      // Check if user has sufficient funds
      if (wallet.balance < parseFloat(amount)) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }
      
      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: parseFloat(amount),
          type: 'TRANSFER',
          status: 'COMPLETED',
          description: `Transfer to ${destinationAccount}`,
          reference: `tra-${uuidv4()}`
        }
      });
      
      // Update wallet balance
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            decrement: parseFloat(amount)
          }
        }
      });
      
      return res.status(201).json({
        message: 'Transfer completed successfully',
        transaction
      });
    } catch (error) {
      console.error('Error processing transfer:', error);
      return res.status(500).json({ error: 'Failed to process transfer' });
    }
  },
  
  /**
   * Get wallet statements
   */
  getStatements: async (req, res) => {
    try {
      const userId = req.user.id;
      const { month, year } = req.query;
      
      if (!month || !year) {
        return res.status(400).json({ error: 'Month and year are required' });
      }
      
      // Get user's wallet
      const wallet = await prisma.wallet.findUnique({
        where: { userId }
      });
      
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      
      // Calculate date range for the requested month
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      
      // Get transactions for the month
      const transactions = await prisma.transaction.findMany({
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
      const statement = {
        month: parseInt(month),
        year: parseInt(year),
        transactions,
        totals,
        openingBalance: 0, // Would need to calculate this from previous month
        closingBalance: wallet.balance,
        currency: wallet.currency
      };
      
      return res.status(200).json(statement);
    } catch (error) {
      console.error('Error getting statement:', error);
      return res.status(500).json({ error: 'Failed to get statement' });
    }
  }
};

module.exports = walletController;
