import { BrokerConnection, BrokerConfig } from './types';
import { IBKRService } from './IBKRService';
import { MetaTraderService } from './MetaTraderService';

export class BrokerFactory {
  private static brokerInstances = new Map<string, BrokerConnection>();

  static async createBroker(config: BrokerConfig): Promise<BrokerConnection> {
    // Check if instance already exists
    const existingBroker = this.brokerInstances.get(config.apiKey);
    if (existingBroker) {
      return existingBroker;
    }

    let broker: BrokerConnection;

    switch (config.name.toLowerCase()) {
      case 'interactive brokers':
      case 'ibkr':
        broker = new IBKRService({
          apiKey: config.apiKey,
          apiSecret: config.apiSecret,
          serverUrl: config.serverUrl,
        });
        break;

      case 'metatrader':
      case 'mt4':
      case 'mt5':
        broker = new MetaTraderService({
          apiKey: config.apiKey,
          apiSecret: config.apiSecret,
          serverUrl: config.serverUrl,
          terminalType: config.name.toLowerCase() === 'mt4' ? 'MT4' : 'MT5',
        });
        break;

      default:
        throw new Error(`Unsupported broker: ${config.name}`);
    }

    // Store the instance
    this.brokerInstances.set(config.apiKey, broker);

    return broker;
  }

  static async destroyBroker(apiKey: string): Promise<void> {
    const broker = this.brokerInstances.get(apiKey);
    if (broker) {
      await broker.disconnect();
      this.brokerInstances.delete(apiKey);
    }
  }

  static async destroyAllBrokers(): Promise<void> {
    for (const [apiKey, broker] of this.brokerInstances) {
      await broker.disconnect();
      this.brokerInstances.delete(apiKey);
    }
  }
}
