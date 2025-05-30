import axios from 'axios';
import { MINING_CONFIG } from '../../config/mining.config';
import { createHmac } from 'crypto';

class NiceHashService {
  private baseUrl = MINING_CONFIG.NICEHASH.API_URL;
  private orgId = MINING_CONFIG.NICEHASH.ORG_ID;
  private apiKey = MINING_CONFIG.NICEHASH.API_KEY;
  private apiSecret = MINING_CONFIG.NICEHASH.API_SECRET;

  private getAuthHeaders(method: string, path: string, query: string = '') {
    const timestamp = Date.now();
    const nonce = timestamp.toString();
    const message = `${this.apiKey}\${timestamp}\${nonce}\${method}\${path}\${query}`;
    const signature = createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');

    return {
      'X-Time': timestamp,
      'X-Nonce': nonce,
      'X-Auth': `${this.apiKey}:${signature}`,
      'X-Organization-Id': this.orgId,
    };
  }

  async getRigs() {
    const path = '/v2/mining/rigs2';
    const headers = this.getAuthHeaders('GET', path);
    
    try {
      const response = await axios.get(`${this.baseUrl}${path}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching NiceHash rigs:', error);
      throw error;
    }
  }

  async setAlgorithm(rigId: string, algorithm: string) {
    const path = `/v2/mining/rigs2/${rigId}/algorithm`;
    const headers = this.getAuthHeaders('POST', path);
    
    try {
      const response = await axios.post(`${this.baseUrl}${path}`, {
        algorithm
      }, { headers });
      return response.data;
    } catch (error) {
      console.error('Error setting algorithm:', error);
      throw error;
    }
  }

  async getProfitability() {
    const path = '/v2/mining/profitability/algorithms';
    const headers = this.getAuthHeaders('GET', path);
    
    try {
      const response = await axios.get(`${this.baseUrl}${path}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching profitability:', error);
      throw error;
    }
  }
}

export const niceHashService = new NiceHashService();
export default niceHashService;
