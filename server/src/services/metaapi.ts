import MetaApi from 'metaapi.cloud-sdk';
import { config } from '../config/config';

let api: MetaApi | null = null;
let isMetaApiEnabled = false;

// Initialize MetaAPI with retry mechanism and validation
if (config.metaApiToken && config.mt5AccountId) {
  try {
    console.log('Initializing MetaApi...');
    api = new MetaApi(config.metaApiToken);
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
      let account = null;
      let retryCount = 0;
      while (!account && retryCount < config.metaApiRetryAttempts) {
        try {
          console.log(`Attempt ${retryCount + 1} to get MT5 account...`);
          account = await api.metatraderAccountApi.getAccount(config.mt5AccountId);
          if (!account) {
            throw new Error('MT5 account not found');
          }
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < config.metaApiRetryAttempts) {
            await new Promise(resolve => setTimeout(resolve, config.metaApiRetryDelay));
          }
        }
      }

      if (!account) {
        throw new Error(`Failed to get MT5 account after ${config.metaApiRetryAttempts} attempts`);
      }

      console.log('MT5 account retrieved successfully');
      
      // Deploy account if needed
      if (account.state !== 'DEPLOYED') {
        console.log('Deploying MT5 account...');
        await account.deploy();
      }

      console.log('Connecting to MT5 account...');
      // @ts-ignore - MetaAPI types are not fully accurate
      cachedConnection = await account.connect();
    }

    return cachedConnection;
  } catch (error) {
    connectionError = error as Error;
    console.error('Failed to establish MetaAPI connection:', error);
    return null;
  }
}

// Add a health check function
export async function checkMetaApiHealth() {
  if (!isMetaApiEnabled) {
    return { status: 'disabled', message: 'MetaAPI is not enabled' };
  }

  try {
    const connection = await getMetaApiConnection();
    return connection 
      ? { status: 'healthy', message: 'MetaAPI connection established' }
      : { status: 'error', message: 'Failed to establish MetaAPI connection' };
  } catch (error) {
    return { status: 'error', message: String(error) };
  }
}

export function isMetaApiServiceEnabled() {
  return isMetaApiEnabled;
}
