import MetaApi from 'metaapi.cloud-sdk';
import { config } from '../config';

// Initialize MetaAPI with retry mechanism
const api = new MetaApi(config.metaApiToken);

// Cache for MetaAPI connections
let cachedConnection: any = null;
let lastConnectionTime: number = 0;
const CONNECTION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export async function getMetaApiConnection() {
  const now = Date.now();
  
  // Check if we have a valid cached connection
  if (cachedConnection && (now - lastConnectionTime) < CONNECTION_TIMEOUT) {
    return cachedConnection;
  }

  // Get a new connection
  for (let attempt = 1; attempt <= config.metaApiRetryAttempts; attempt++) {
    try {
      const accounts = await api.metatraderAccountApi.getAccounts();
      console.log('Available accounts:', accounts.map(acc => ({ 
        id: acc.id, 
        login: acc.login,
        name: acc.name,
        type: acc.type,
        state: acc.state 
      })));
      
      cachedConnection = api;
      lastConnectionTime = now;
      return cachedConnection;
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error);
      if (attempt === config.metaApiRetryAttempts) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, config.metaApiRetryDelay));
    }
  }
}
