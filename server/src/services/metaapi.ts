import MetaApi, { MetatraderAccount } from 'metaapi.cloud-sdk';
import { config } from '../config/config';

let api: MetaApi | null = null;
let isMetaApiEnabled = false;

// Initialize MetaAPI with retry mechanism and validation
if (config.mt5.apiToken && config.mt5.accountId) {
  try {
    console.log('Initializing MetaApi...');
    api = new MetaApi(config.mt5.apiToken);
    isMetaApiEnabled = true;
    console.log('MetaAPI initialized successfully');
  } catch (error) {
    console.error('Failed to initialize MetaAPI:', error);
    api = null;
    isMetaApiEnabled = false;
  }
} else {
  console.warn('MetaAPI credentials not found. Trading features will be disabled.');
}

// Cache for MetaAPI connections
let cachedConnection: any = null;
let connectionError: Error | null = null;

export async function getMetaApiConnection() {
  if (!isMetaApiEnabled || !api) {
    return null;
  }

  try {
    if (connectionError) {
      console.error('Previous connection attempt failed:', connectionError);
      connectionError = null; // Reset error to try again
    }

    if (!cachedConnection) {
      console.log('Initializing MetaAPI connection...');
      
      // Create MT5 account instance with retries
      let account: MetatraderAccount | null = null;
      let retryCount = 0;
      while (!account && retryCount < config.mt5.retryAttempts) {
        try {
          console.log(`Attempt ${retryCount + 1} to get MT5 account...`);
          account = await api.metatraderAccountApi.getAccount(config.mt5.accountId);
          if (!account) {
            throw new Error('MT5 account not found');
          }
        } catch (error) {
          console.error(`Failed to get MT5 account (attempt ${retryCount + 1}):`, error);
          retryCount++;
          if (retryCount < config.mt5.retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, config.mt5.retryDelay));
          }
        }
      }

      if (!account) {
        throw new Error(`Failed to get MT5 account after ${config.mt5.retryAttempts} attempts`);
      }

      // Deploy account if needed
      const status = await account.waitConnected();
      if (!status) {
        console.log('Deploying MT5 account...');
        await account.deploy();
        await account.waitDeployed();
      }

      // Connect to account
      console.log('Connecting to MT5 account...');
      const connection = account.getRPCConnection();
      await connection.connect();
      cachedConnection = connection;
    }

    return cachedConnection;
  } catch (error) {
    connectionError = error as Error;
    console.error('Failed to establish MetaAPI connection:', error);
    return null;
  }
}

// Add a health check function
export async function checkMetaApiHealth(): Promise<boolean> {
  try {
    const connection = await getMetaApiConnection();
    return connection !== null;
  } catch (error) {
    console.error('MetaAPI health check failed:', error);
    return false;
  }
}

export function isMetaApiServiceEnabled(): boolean {
  return isMetaApiEnabled;
}
