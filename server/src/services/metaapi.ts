import MetaApi from 'metaapi.cloud-sdk';
import { config } from '../config/config';

class MetaApiService {
  private api: any;
  private connection: any;

  constructor() {
    if (!config.META_API_TOKEN) {
      console.warn('MetaAPI token not configured');
      return;
    }

    this.api = new MetaApi(config.META_API_TOKEN);
  }

  async connect() {
    try {
      if (!config.MT5_ACCOUNT_ID) {
        throw new Error('MT5 account ID not configured');
      }

      const account = await this.api.metatraderAccountApi.getAccount(config.MT5_ACCOUNT_ID);
      this.connection = await account.connect();
      
      console.log('Connected to MetaTrader account');
      return true;
    } catch (error) {
      console.error('Failed to connect to MetaTrader account:', error);
      return false;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
      console.log('Disconnected from MetaTrader account');
    }
  }
}

export const metaApiService = new MetaApiService();
