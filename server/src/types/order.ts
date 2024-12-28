export interface OrderMessage {
  type: 'placeOrder' | 'cancelOrder' | 'modifyOrder';
  symbol?: string;
  orderType?: 'market' | 'limit';
  side?: 'buy' | 'sell';
  quantity?: number;
  price?: number;
  orderId?: string;
}
