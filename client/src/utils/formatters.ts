export const formatNumber = (value: number, isCurrency: boolean = false): string => {
  if (typeof value !== 'number') return '-';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: isCurrency ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
  
  return formatter.format(value);
};

export const formatPercent = (value: number): string => {
  if (typeof value !== 'number') return '-';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(value / 100);
};

export const formatDate = (date: Date): string => {
  if (!(date instanceof Date)) return '-';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

export const formatPips = (value: number): string => {
  return `${formatNumber(value, 1)} pips`;
};

export const formatCompact = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};
