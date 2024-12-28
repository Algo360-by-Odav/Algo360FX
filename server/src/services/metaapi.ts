import MetaApi, { MetatraderAccount, RpcConnection } from 'metaapi.cloud-sdk';
import { config } from '../config/config';

interface SymbolPrice {
  symbol: string;
  bid: number;
  ask: number;
  profitTickValue: number;
  lossTickValue: number;
  accountCurrencyExchangeRate: number;
  time: Date;
}

interface OrderResult {
  orderId: string;
  success: boolean;
  message?: string;
}

let metaApi: MetaApi | null = null;

export async function initializeMetaApi(): Promise<MetaApi> {
  if (!metaApi) {
    if (!config.META_API_TOKEN) {
      throw new Error('MetaAPI token not configured');
    }
    metaApi = new MetaApi(config.META_API_TOKEN);
  }
  return metaApi;
}

export async function getMetaApiConnection(): Promise<RpcConnection> {
  if (!metaApi) {
    await initializeMetaApi();
  }

  try {
    if (!config.MT5_ACCOUNT_ID) {
      throw new Error('MT5 account ID not configured');
    }

    const account: MetatraderAccount = await metaApi!.metatraderAccountApi.getAccount(config.MT5_ACCOUNT_ID);
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

export async function getMarketData(symbol: string): Promise<SymbolPrice> {
  const connection = await getMetaApiConnection();
  try {
    const price = await connection.getSymbolPrice(symbol);
    return {
      symbol,
      bid: price.bid,
      ask: price.ask,
      profitTickValue: price.profitTickValue,
      lossTickValue: price.lossTickValue,
      accountCurrencyExchangeRate: price.accountCurrencyExchangeRate,
      time: new Date(price.time)
    };
  } catch (error) {
    console.error('Error getting market data:', error);
    throw error;
  }
}

export async function placeMarketOrder(
  symbol: string,
  type: 'buy' | 'sell',
  volume: number,
  stopLoss?: number,
  takeProfit?: number
): Promise<OrderResult> {
  const connection = await getMetaApiConnection();
  try {
    const result = await connection.createMarketBuyOrder(symbol, volume, {
      stopLoss,
      takeProfit,
    });

    return {
      orderId: result.orderId,
      success: true
    };
  } catch (error) {
    console.error('Error placing market order:', error);
    return {
      orderId: '',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
