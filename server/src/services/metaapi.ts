import MetaApi from 'metaapi.cloud-sdk';
import { config } from '../config/config';
import { OrderType, OrderTimeInForce, OrderStatus } from '../types/market';

// Interfaces with readonly properties for better immutability
export interface SymbolPrice {
  readonly symbol: string;
  readonly bid: number;
  readonly ask: number;
  readonly profitTickValue: number;
  readonly lossTickValue: number;
  readonly accountCurrencyExchangeRate: number;
  readonly time: Date;
}

export interface OrderOptions {
  readonly stopLoss?: number;
  readonly takeProfit?: number;
  readonly timeInForce?: OrderTimeInForce;
  readonly comment?: string;
  readonly clientId?: string;
}

export interface OrderResult {
  readonly orderId: string;
  readonly status: OrderStatus;
  readonly success: boolean;
  readonly message?: string;
  readonly filledVolume?: number;
  readonly remainingVolume?: number;
  readonly averagePrice?: number;
}

export interface ConnectionOptions {
  readonly retryCount?: number;
  readonly timeoutInSeconds?: number;
  readonly synchronizationTimeoutInSeconds?: number;
}

// Singleton instance with proper type
let metaApi: MetaApi | null = null;

// Initialize MetaApi with proper error handling and validation
export async function initializeMetaApi(options?: ConnectionOptions): Promise<MetaApi> {
  if (!metaApi) {
    if (!config.META_API_TOKEN) {
      throw new Error('MetaAPI token not configured');
    }
    metaApi = new MetaApi(config.META_API_TOKEN);
  }
  return metaApi;
}

// Get MetaApi connection with proper error handling and options
export async function getMetaApiConnection(options: ConnectionOptions = {}): Promise<any> {
  if (!metaApi) {
    await initializeMetaApi(options);
  }

  try {
    if (!config.MT5_ACCOUNT_ID) {
      throw new Error('MT5 account ID not configured');
    }

    const account: any = await metaApi.metatraderAccountApi.getAccount(config.MT5_ACCOUNT_ID);
    if (!account) {
      throw new Error('MT5 account not found');
    }

    const connection = account.getRPCConnection();
    await connection.connect();
    
    const timeoutMs = (options.synchronizationTimeoutInSeconds || 60) * 1000;
    if (!await connection.waitSynchronized(timeoutMs)) {
      throw new Error(`Failed to synchronize with MT5 within ${timeoutMs}ms`);
    }

    return connection;
  } catch (error) {
    console.error('MetaAPI connection error:', error);
    throw error instanceof Error ? error : new Error('Unknown connection error occurred');
  }
}

// Get market data with proper error handling and validation
export async function getMarketData(symbol: string): Promise<SymbolPrice> {
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Invalid symbol provided');
  }

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
    throw error instanceof Error ? error : new Error('Unknown error getting market data');
  }
}

// Place market order with proper error handling and validation
export async function placeMarketOrder(
  symbol: string,
  type: OrderType,
  volume: number,
  options?: OrderOptions
): Promise<OrderResult> {
  // Input validation
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Invalid symbol provided');
  }
  if (volume <= 0) {
    throw new Error('Volume must be greater than 0');
  }

  const connection = await getMetaApiConnection();
  try {
    const orderFn = type === OrderType.Buy ? 
      connection.createMarketBuyOrder.bind(connection) : 
      connection.createMarketSellOrder.bind(connection);

    const result = await orderFn(symbol, volume, {
      stopLoss: options?.stopLoss,
      takeProfit: options?.takeProfit,
      comment: options?.comment,
      clientId: options?.clientId,
    });

    return {
      orderId: result.orderId,
      status: OrderStatus.Executed,
      success: true,
      filledVolume: volume,
      averagePrice: type === OrderType.Buy ? 
        (await connection.getSymbolPrice(symbol)).ask : 
        (await connection.getSymbolPrice(symbol)).bid
    };
  } catch (error) {
    console.error('Error placing market order:', error);
    return {
      orderId: '',
      status: OrderStatus.Rejected,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Subscribe to market data with proper error handling and validation
export async function subscribeToMarketData(symbol: string, callback: (data: any) => void): Promise<() => void> {
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Invalid symbol provided');
  }

  const connection = await getMetaApiConnection();
  try {
    await connection.subscribeToMarketData(symbol);

    connection.on('onSymbolPriceUpdated', (data: any) => {
      callback(data);
    });

    return () => connection.unsubscribeFromMarketData(symbol);
  } catch (error) {
    console.error('Error subscribing to market data:', error);
    throw error instanceof Error ? error : new Error('Unknown error subscribing to market data');
  }
}
