import axios from 'axios';
import { MINING_CONFIG } from '../../config/mining.config';

interface CoinProfitability {
  coin: string;
  algorithm: string;
  profitability: number;
  difficulty: number;
  networkHashrate: number;
}

class WhatToMineService {
  private baseUrl = MINING_CONFIG.WHATTOMINE.API_URL;
  private cache: { [key: string]: { data: any; timestamp: number } } = {};

  private isCacheValid(key: string): boolean {
    const cacheEntry = this.cache[key];
    if (!cacheEntry) return false;
    
    const now = Date.now();
    return now - cacheEntry.timestamp < MINING_CONFIG.WHATTOMINE.REFRESH_INTERVAL;
  }

  async getGPUCoins(): Promise<CoinProfitability[]> {
    const cacheKey = 'gpu_coins';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].data;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/coins/GPU`);
      const coins = Object.values(response.data.coins).map((coin: any) => ({
        coin: coin.tag,
        algorithm: coin.algorithm,
        profitability: coin.btc_revenue24,
        difficulty: coin.difficulty,
        networkHashrate: coin.nethash
      }));

      this.cache[cacheKey] = {
        data: coins,
        timestamp: Date.now()
      };

      return coins;
    } catch (error) {
      console.error('Error fetching GPU coins:', error);
      throw error;
    }
  }

  async getCalculatedProfitability(params: {
    hashrate: number;
    power: number;
    cost: number;
    algorithm: string;
  }): Promise<{
    revenue: number;
    profit: number;
    powerCost: number;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/calculator`, {
        params: {
          ...params,
          factor: params.algorithm
        }
      });

      return {
        revenue: response.data.revenue,
        profit: response.data.profit,
        powerCost: response.data.power_cost
      };
    } catch (error) {
      console.error('Error calculating profitability:', error);
      throw error;
    }
  }

  async getMostProfitableAlgorithm(hashrates: { [key: string]: number }): Promise<{
    algorithm: string;
    estimatedProfit: number;
    coin: string;
  }> {
    const coins = await this.getGPUCoins();
    let bestAlgorithm = {
      algorithm: '',
      estimatedProfit: 0,
      coin: ''
    };

    for (const coin of coins) {
      if (hashrates[coin.algorithm]) {
        const profitability = await this.getCalculatedProfitability({
          hashrate: hashrates[coin.algorithm],
          power: 100, // Default power consumption
          cost: 0.1, // Default power cost per kWh
          algorithm: coin.algorithm
        });

        if (profitability.profit > bestAlgorithm.estimatedProfit) {
          bestAlgorithm = {
            algorithm: coin.algorithm,
            estimatedProfit: profitability.profit,
            coin: coin.coin
          };
        }
      }
    }

    return bestAlgorithm;
  }
}

export const whatToMineService = new WhatToMineService();
export default whatToMineService;
