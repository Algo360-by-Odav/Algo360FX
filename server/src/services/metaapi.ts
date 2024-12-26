import MetaApi from 'metaapi.cloud-sdk';
import { config } from '../config/config';

let metaApi: any = null;

export async function initializeMetaApi() {
  if (!metaApi) {
    metaApi = new MetaApi(config.META_API_TOKEN);
  }
  return metaApi;
}

export async function getMetaApiConnection() {
  if (!metaApi) {
    await initializeMetaApi();
  }

  try {
    const account = await metaApi.metatraderAccountApi.getAccount(config.MT5_ACCOUNT_ID);
    if (!account) {
      throw new Error('MT5 account not found');
    }

    const connection = account.getRPCConnection();
    await connection.connect();
    
    if (!await connection.waitSynchronized(60000)) {
      throw new Error('Failed to synchronize with MT5');
    }

    return connection;
  } catch (error) {
    console.error('MetaAPI connection error:', error);
    throw error;
  }
}

export async function getMarketData(symbol: string) {
  const connection = await getMetaApiConnection();
  try {
    const price = await connection.getSymbolPrice(symbol);
    return {
      symbol,
      bid: price.bid,
      ask: price.ask,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error getting market data for ${symbol}:`, error);
    throw error;
  }
}

export async function placeMarketOrder(symbol: string, type: 'buy' | 'sell', volume: number) {
  const connection = await getMetaApiConnection();
  try {
    const result = await connection.createMarketBuyOrder(symbol, volume);
    return {
      orderId: result.orderId,
      symbol,
      type,
      volume,
      openPrice: result.openPrice,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error placing market order for ${symbol}:`, error);
    throw error;
  }
}
