import MetaApi from 'metaapi.cloud-sdk';
import { config } from '../config/config';

let api: MetaApi | null = null;
let isMetaApiEnabled = false;

// Initialize MetaAPI with retry mechanism and validation
if (config.metaApiToken && config.mt5AccountId) {
  try {
    console.log('Initializing MetaApi with token:', config.metaApiToken.substring(0, 5) + '...');
    console.log('Using MT5 Account ID:', config.mt5AccountId);
    console.log('Retry attempts:', config.metaApiRetryAttempts);
    console.log('Retry delay:', config.metaApiRetryDelay);

    api = new MetaApi(config.metaApiToken);
    isMetaApiEnabled = true;
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
      console.log('Using MT5 Account ID:', config.mt5AccountId);
      
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
          console.log('MT5 account found successfully');
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < config.metaApiRetryAttempts) {
            console.log(`Waiting ${config.metaApiRetryDelay}ms before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, config.metaApiRetryDelay));
          }
        }
      }

      if (!account) {
        throw new Error('Failed to get MT5 account after all retry attempts');
      }

      // Deploy account with retries
      let deployedAccount = null;
      retryCount = 0;
      while (!deployedAccount && retryCount < config.metaApiRetryAttempts) {
        try {
          console.log(`Attempt ${retryCount + 1} to deploy account...`);
          deployedAccount = await account.deploy();
          console.log('Account deployed successfully');
        } catch (error) {
          console.error(`Deploy attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < config.metaApiRetryAttempts) {
            console.log(`Waiting ${config.metaApiRetryDelay}ms before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, config.metaApiRetryDelay));
          }
        }
      }

      if (!deployedAccount) {
        throw new Error('Failed to deploy account after all retry attempts');
      }

      try {
        console.log('Waiting for account to connect...');
        await account.waitConnected();

        console.log('Waiting for account to synchronize...');
        await account.waitSynchronized();

        console.log('MetaAPI connection established and synchronized');
        cachedConnection = account;
      } catch (error) {
        console.error('Error while waiting for account connection:', error);
        throw error;
      }
    }

    return cachedConnection;
  } catch (error) {
    console.error('MetaAPI connection error:', error);
    connectionError = error as Error;
    throw error;
  }
}

// Add a health check function
export async function checkMetaApiHealth() {
  if (!isMetaApiEnabled) {
    return { status: 'disabled', message: 'MetaAPI is not configured' };
  }

  try {
    const connection = await getMetaApiConnection();
    return { status: 'connected', connection };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

export function isMetaApiServiceEnabled() {
  return isMetaApiEnabled;
}
