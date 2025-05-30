import { makeAutoObservable } from 'mobx';

export interface PriceData {
  timestamp: string;
  price: number;
  currency: string;
}

export class PriceStore {
  prices: PriceData[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPrices(prices: PriceData[]) {
    this.prices = prices;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // Mock data for testing
  generateMockPrices(currency: string, days: number = 30) {
    const now = new Date();
    const prices: PriceData[] = [];
    let basePrice = this.getBasePrice(currency);

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - (days - i) * 24 * 60 * 60 * 1000);
      const randomChange = (Math.random() - 0.5) * 0.002; // Random price change
      basePrice *= (1 + randomChange);
      
      prices.push({
        timestamp: date.toISOString(),
        price: basePrice,
        currency,
      });
    }

    this.setPrices(prices);
  }

  private getBasePrice(currency: string): number {
    switch (currency) {
      case 'EUR/USD':
        return 1.0850;
      case 'GBP/USD':
        return 1.2650;
      case 'USD/JPY':
        return 148.50;
      case 'USD/CHF':
        return 0.8750;
      case 'AUD/USD':
        return 0.6550;
      case 'USD/CAD':
        return 1.3450;
      default:
        return 1.0000;
    }
  }
}

export const priceStore = new PriceStore();
