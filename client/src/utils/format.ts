// Number formatting
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Currency formatting
export const formatCurrency = (value: number, currency: string = 'USD', decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

// Percentage formatting
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Date formatting
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return `${formatDate(date)} ${formatTime(date)}`;
}

// Volume formatting
export const formatVolume = (volume: number): string => {
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  }
  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  }
  return volume.toString();
};

// Price formatting based on instrument type
export const formatPrice = (price: number, instrument: string): string => {
  // Crypto typically needs more decimal places
  if (instrument.includes('BTC') || instrument.includes('ETH')) {
    return formatNumber(price, 8);
  }
  // Forex pairs typically need 4 or 2 decimal places
  if (instrument.includes('JPY')) {
    return formatNumber(price, 2);
  }
  return formatNumber(price, 4);
};

// Format pip value
export const formatPips = (pips: number): string => {
  return pips.toFixed(1);
};

// Format position size
export const formatPositionSize = (size: number): string => {
  return size.toFixed(2);
};

// Format profit/loss
export const formatPnL = (pnl: number, currency: string = 'USD'): string => {
  const formatted = formatCurrency(Math.abs(pnl), currency);
  return pnl >= 0 ? `+${formatted}` : `-${formatted}`;
};

// Format leverage
export const formatLeverage = (leverage: number): string => {
  return `${leverage}x`;
};

// Format margin
export const formatMargin = (margin: number, currency: string = 'USD'): string => {
  return formatCurrency(margin, currency);
};

// Format time ago
export const formatTimeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatDate(date);
};

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
