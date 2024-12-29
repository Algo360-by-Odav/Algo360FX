import MetaApi from 'metaapi.cloud-sdk';
import { config } from '../config/config';

// Initialize MetaAPI with retry mechanism and validation
if (!config.metaApiToken) {
  console.error('META_API_TOKEN is not set');
  throw new Error('META_API_TOKEN is required');
}

if (!config.mt5AccountId) {
  console.error('MT5_ACCOUNT_ID is not set');
  throw new Error('MT5_ACCOUNT_ID is required');
}

const api = new MetaApi(config.metaApiToken);

// Cache for MetaAPI connections
let cachedConnection: any = null;
let connectionError: Error | null = null;

export async function getMetaApiConnection() {
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
          account = await api.metatraderAccountApi.getAccount(config.mt5AccountId);
          if (!account) {
            throw new Error('MT5 account not found');
          }
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < config.metaApiRetryAttempts) {
            await new Promise(resolve => setTimeout(resolve, config.metaApiRetryDelay));
          } else {
            throw error;
          }
        }
      }

      console.log('MT5 account found, deploying...');
      
      // Deploy account with retries
      let deployedAccount = null;
      retryCount = 0;
      while (!deployedAccount && retryCount < config.metaApiRetryAttempts) {
        try {
          deployedAccount = await account.deploy();
          console.log('Account deployed, waiting for connection...');
          await deployedAccount.waitConnected();
        } catch (error) {
          console.error(`Deploy attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < config.metaApiRetryAttempts) {
            await new Promise(resolve => setTimeout(resolve, config.metaApiRetryDelay));
          } else {
            throw error;
          }
        }
      }

      console.log('Account connected to broker');

      // Get connection instance
      try {
        cachedConnection = await deployedAccount.getStreamingConnection();
        await cachedConnection.connect();
        await cachedConnection.waitSynchronized();
        console.log('MetaAPI connection established and synchronized');
      } catch (error) {
        console.error('Failed to establish streaming connection:', error);
        connectionError = error as Error;
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
  try {
    const connection = await getMetaApiConnection();
    return {
      status: 'connected',
      error: null
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
