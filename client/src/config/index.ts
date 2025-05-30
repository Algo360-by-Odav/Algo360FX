export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const CHART_COLORS = {
  primary: 'rgb(75, 192, 192)',
  primaryLight: 'rgba(75, 192, 192, 0.1)',
  secondary: 'rgb(255, 99, 132)',
  secondaryLight: 'rgba(255, 99, 132, 0.1)',
  tertiary: 'rgb(54, 162, 235)',
  tertiaryLight: 'rgba(54, 162, 235, 0.1)',
  quaternary: 'rgb(255, 159, 64)',
  quaternaryLight: 'rgba(255, 159, 64, 0.1)',
  quinary: 'rgb(153, 102, 255)',
  quinaryLight: 'rgba(153, 102, 255, 0.1)',
  senary: 'rgb(255, 205, 86)',
  senaryLight: 'rgba(255, 205, 86, 0.1)',
  gray: 'rgb(201, 203, 207)',
  grayLight: 'rgba(201, 203, 207, 0.1)',
};

export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Price Chart',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const DEFAULT_TIMEFRAME = '1h';

export const TIMEFRAMES = {
  '1m': '1 Minute',
  '5m': '5 Minutes',
  '15m': '15 Minutes',
  '30m': '30 Minutes',
  '1h': '1 Hour',
  '4h': '4 Hours',
  '1d': '1 Day',
  '1w': '1 Week',
  '1M': '1 Month',
} as const;

export type TimeFrame = keyof typeof TIMEFRAMES;
