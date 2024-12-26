import MetaApi from 'metaapi.cloud-sdk';
import { config } from '../config/config';

// Initialize MetaAPI with retry mechanism
const api = new MetaApi(config.metaApiToken);

// Cache for MetaAPI connections
let cachedConnection: any = null;

export async function getMetaApiConnection() {
  try {
    if (!cachedConnection) {
      console.log('Initializing MetaAPI connection...');
      
      // Create MT5 account instance
      const account = await api.metatraderAccountApi.getAccount(config.mt5AccountId);
      if (!account) {
        throw new Error('MT5 account not found');
      }

      console.log('MT5 account found, deploying...');
      
      // Deploy account
      const deployedAccount = await account.deploy();
      console.log('Account deployed, waiting for connection...');
      
      // Wait until account is deployed and connected to broker
      await deployedAccount.waitConnected();
      console.log('Account connected to broker');

      // Get connection instance
      cachedConnection = await deployedAccount.getStreamingConnection();
      await cachedConnection.connect();
      await cachedConnection.waitSynchronized();
      
      console.log('MetaAPI connection established and synchronized');
    }

    return cachedConnection;
  } catch (error) {
    console.error('MetaAPI connection error:', error);
    throw error;
  }
}
