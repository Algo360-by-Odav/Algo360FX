import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';

/**
 * Service for handling wallet-related API calls
 */
class WalletService {
  /**
   * Get wallet balance and information
   * @returns {Promise} Promise object with wallet data
   */
  async getWalletBalance() {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/balance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   * @param {Object} params Query parameters like limit, offset, startDate, endDate, type
   * @returns {Promise} Promise object with transactions
   */
  async getTransactions(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/transactions`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Get user payment methods
   * @returns {Promise} Promise object with payment methods
   */
  async getPaymentMethods() {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  /**
   * Add a new payment method
   * @param {Object} paymentMethod Payment method data
   * @returns {Promise} Promise object with the new payment method
   */
  async addPaymentMethod(paymentMethod) {
    try {
      const response = await axios.post(`${API_BASE_URL}/wallet/payment-methods`, paymentMethod);
      return response.data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  /**
   * Remove a payment method
   * @param {string} paymentMethodId ID of the payment method to remove
   * @returns {Promise} Promise object with success status
   */
  async removePaymentMethod(paymentMethodId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/wallet/payment-methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing payment method:', error);
      throw error;
    }
  }

  /**
   * Set a payment method as default
   * @param {string} paymentMethodId ID of the payment method
   * @returns {Promise} Promise object with updated payment method
   */
  async setDefaultPaymentMethod(paymentMethodId) {
    try {
      const response = await axios.put(`${API_BASE_URL}/wallet/payment-methods/${paymentMethodId}/default`);
      return response.data;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  /**
   * Deposit funds
   * @param {Object} depositData Deposit information (amount, paymentMethodId)
   * @returns {Promise} Promise object with deposit transaction
   */
  async deposit(depositData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/wallet/deposit`, depositData);
      return response.data;
    } catch (error) {
      console.error('Error making deposit:', error);
      throw error;
    }
  }

  /**
   * Withdraw funds
   * @param {Object} withdrawData Withdrawal information (amount, paymentMethodId)
   * @returns {Promise} Promise object with withdrawal transaction
   */
  async withdraw(withdrawData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/wallet/withdraw`, withdrawData);
      return response.data;
    } catch (error) {
      console.error('Error making withdrawal:', error);
      throw error;
    }
  }

  /**
   * Transfer funds between accounts
   * @param {Object} transferData Transfer information (amount, destinationAccount)
   * @returns {Promise} Promise object with transfer transaction
   */
  async transfer(transferData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/wallet/transfer`, transferData);
      return response.data;
    } catch (error) {
      console.error('Error transferring funds:', error);
      throw error;
    }
  }

  /**
   * Get wallet statements
   * @param {Object} params Query parameters like month, year
   * @returns {Promise} Promise object with statements
   */
  async getStatements(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/statements`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching statements:', error);
      throw error;
    }
  }
}

export default new WalletService();
