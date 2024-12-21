/**
 * Format a number as currency with specified currency symbol and decimal places
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  decimals: number = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number as a percentage with specified decimal places
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2,
  includeSign: boolean = false
): string => {
  const formatted = (value * 100).toFixed(decimals) + '%';
  return includeSign && value > 0 ? `+${formatted}` : formatted;
};

/**
 * Format a number with commas as thousands separators
 */
export const formatNumber = (
  value: number,
  decimals: number = 0
): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a date to a string with specified format
 */
export const formatDate = (
  date: Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const options: Intl.DateTimeFormatOptions = {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  }[format];

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format a price with specified decimal places
 */
export const formatPrice = (
  value: number | undefined | null,
  decimals: number = 4
): string => {
  if (value === undefined || value === null) {
    return '0.0000';
  }
  return value.toFixed(decimals);
};

/**
 * Format a pip value with specified decimal places
 */
export const formatPips = (
  value: number,
  decimals: number = 1
): string => {
  return value.toFixed(decimals);
};

/**
 * Format a duration in milliseconds to a human-readable string
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Format a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};
