export const MINING_CONFIG = {
  // NiceHash API Configuration
  NICEHASH: {
    API_URL: 'https://api2.nicehash.com',
    ORG_ID: process.env.REACT_APP_NICEHASH_ORG_ID,
    API_KEY: process.env.REACT_APP_NICEHASH_API_KEY,
    API_SECRET: process.env.REACT_APP_NICEHASH_API_SECRET
  },

  // HiveOS API Configuration
  HIVEOS: {
    API_URL: 'https://api2.hiveos.farm/api/v2',
    API_TOKEN: process.env.REACT_APP_HIVEOS_API_TOKEN
  },

  // WhatToMine API Configuration
  WHATTOMINE: {
    API_URL: 'https://whattomine.com/api/v1',
    REFRESH_INTERVAL: 300000 // 5 minutes
  },

  // Market Data APIs
  MARKET: {
    BINANCE: {
      API_URL: 'https://api.binance.com/api/v3',
      API_KEY: process.env.REACT_APP_BINANCE_API_KEY,
      API_SECRET: process.env.REACT_APP_BINANCE_API_SECRET
    },
    COINGECKO: {
      API_URL: 'https://api.coingecko.com/api/v3'
    }
  },

  // Notification Settings
  NOTIFICATIONS: {
    TELEGRAM_BOT_TOKEN: process.env.REACT_APP_TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.REACT_APP_TELEGRAM_CHAT_ID,
    EMAIL_SERVICE: {
      SMTP_HOST: process.env.REACT_APP_SMTP_HOST,
      SMTP_PORT: process.env.REACT_APP_SMTP_PORT,
      SMTP_USER: process.env.REACT_APP_SMTP_USER,
      SMTP_PASS: process.env.REACT_APP_SMTP_PASS
    }
  },

  // Auto-switching Configuration
  AUTO_SWITCH: {
    MIN_PROFIT_THRESHOLD: 0.05, // 5% minimum profit increase to switch
    COOLDOWN_PERIOD: 3600000, // 1 hour between switches
    CHECK_INTERVAL: 300000 // Check every 5 minutes
  }
};
