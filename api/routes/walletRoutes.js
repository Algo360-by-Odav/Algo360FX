const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all wallet routes
router.use(authenticate);

// Wallet balance
router.get('/balance', walletController.getWalletBalance);

// Transactions
router.get('/transactions', walletController.getTransactions);

// Payment methods
router.get('/payment-methods', walletController.getPaymentMethods);
router.post('/payment-methods', walletController.addPaymentMethod);
router.delete('/payment-methods/:id', walletController.removePaymentMethod);
router.put('/payment-methods/:id/default', walletController.setDefaultPaymentMethod);

// Deposits
router.post('/deposit', walletController.deposit);

// Withdrawals
router.post('/withdraw', walletController.withdraw);

// Transfers
router.post('/transfer', walletController.transfer);

// Statements
router.get('/statements', walletController.getStatements);

module.exports = router;
