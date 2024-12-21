import { makeAutoObservable } from 'mobx';
import { MarketDataService } from '../marketData/MarketDataService';

export interface Alert {
  id: string;
  type: AlertType;
  symbol: string;
  condition: AlertCondition;
  value: number;
  message: string;
  createdAt: Date;
  triggeredAt?: Date;
  status: AlertStatus;
  priority: AlertPriority;
}

export enum AlertType {
  PRICE = 'PRICE',
  TECHNICAL = 'TECHNICAL',
  NEWS = 'NEWS',
  VOLATILITY = 'VOLATILITY',
  TRADE = 'TRADE',
  RISK = 'RISK'
}

export enum AlertCondition {
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  CROSSES_ABOVE = 'CROSSES_ABOVE',
  CROSSES_BELOW = 'CROSSES_BELOW',
  EQUALS = 'EQUALS',
  PERCENT_CHANGE = 'PERCENT_CHANGE'
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  TRIGGERED = 'TRIGGERED',
  DISMISSED = 'DISMISSED',
  EXPIRED = 'EXPIRED'
}

export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AlertNotification {
  id: string;
  alertId: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: AlertPriority;
}

class AlertsService {
  private alerts: Map<string, Alert> = new Map();
  private notifications: AlertNotification[] = [];
  private subscribers: Set<(notification: AlertNotification) => void> = new Set();
  private marketDataService: MarketDataService;

  constructor(marketDataService: MarketDataService) {
    this.marketDataService = marketDataService;
    makeAutoObservable(this);
    this.initializeAlertListeners();
  }

  private initializeAlertListeners() {
    // Subscribe to market data updates
    this.marketDataService.onPriceUpdate((symbol, price) => {
      this.checkPriceAlerts(symbol, price);
    });

    // Subscribe to technical indicator updates
    this.marketDataService.onIndicatorUpdate((symbol, indicator, value) => {
      this.checkTechnicalAlerts(symbol, indicator, value);
    });

    // Subscribe to volatility updates
    this.marketDataService.onVolatilityUpdate((symbol, volatility) => {
      this.checkVolatilityAlerts(symbol, volatility);
    });
  }

  createAlert(
    type: AlertType,
    symbol: string,
    condition: AlertCondition,
    value: number,
    message: string,
    priority: AlertPriority = AlertPriority.MEDIUM
  ): Alert {
    const alert: Alert = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      symbol,
      condition,
      value,
      message,
      createdAt: new Date(),
      status: AlertStatus.ACTIVE,
      priority
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private checkPriceAlerts(symbol: string, price: number) {
    this.alerts.forEach(alert => {
      if (alert.status !== AlertStatus.ACTIVE || alert.type !== AlertType.PRICE || alert.symbol !== symbol) {
        return;
      }

      let triggered = false;
      switch (alert.condition) {
        case AlertCondition.GREATER_THAN:
          triggered = price > alert.value;
          break;
        case AlertCondition.LESS_THAN:
          triggered = price < alert.value;
          break;
        case AlertCondition.EQUALS:
          triggered = Math.abs(price - alert.value) < 0.0001;
          break;
        case AlertCondition.PERCENT_CHANGE:
          const percentChange = ((price - alert.value) / alert.value) * 100;
          triggered = Math.abs(percentChange) >= alert.value;
          break;
      }

      if (triggered) {
        this.triggerAlert(alert, `${symbol} price ${alert.condition} ${alert.value}`);
      }
    });
  }

  private checkTechnicalAlerts(symbol: string, indicator: string, value: number) {
    this.alerts.forEach(alert => {
      if (alert.status !== AlertStatus.ACTIVE || alert.type !== AlertType.TECHNICAL || alert.symbol !== symbol) {
        return;
      }

      let triggered = false;
      switch (alert.condition) {
        case AlertCondition.CROSSES_ABOVE:
          triggered = value > alert.value;
          break;
        case AlertCondition.CROSSES_BELOW:
          triggered = value < alert.value;
          break;
      }

      if (triggered) {
        this.triggerAlert(alert, `${symbol} ${indicator} ${alert.condition} ${alert.value}`);
      }
    });
  }

  private checkVolatilityAlerts(symbol: string, volatility: number) {
    this.alerts.forEach(alert => {
      if (alert.status !== AlertStatus.ACTIVE || alert.type !== AlertType.VOLATILITY || alert.symbol !== symbol) {
        return;
      }

      if (volatility >= alert.value) {
        this.triggerAlert(alert, `${symbol} volatility exceeded ${alert.value}%`);
      }
    });
  }

  private triggerAlert(alert: Alert, defaultMessage?: string) {
    alert.status = AlertStatus.TRIGGERED;
    alert.triggeredAt = new Date();

    const notification: AlertNotification = {
      id: Math.random().toString(36).substring(2, 15),
      alertId: alert.id,
      message: alert.message || defaultMessage || '',
      timestamp: new Date(),
      read: false,
      priority: alert.priority
    };

    this.notifications.push(notification);
    this.notifySubscribers(notification);
  }

  subscribe(callback: (notification: AlertNotification) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(notification: AlertNotification) {
    this.subscribers.forEach(callback => callback(notification));
  }

  getAlerts(): Alert[] {
    return Array.from(this.alerts.values());
  }

  getActiveAlerts(): Alert[] {
    return this.getAlerts().filter(alert => alert.status === AlertStatus.ACTIVE);
  }

  getNotifications(unreadOnly: boolean = false): AlertNotification[] {
    return unreadOnly 
      ? this.notifications.filter(n => !n.read)
      : this.notifications;
  }

  markNotificationAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  dismissAlert(alertId: string) {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.status = AlertStatus.DISMISSED;
    }
  }

  clearAllNotifications() {
    this.notifications = [];
  }
}

export const alertsService = new AlertsService(MarketDataService.getInstance());
