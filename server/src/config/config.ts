import dotenv from 'dotenv';
import { Config } from '../../types/config';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  env: 'development' | 'production' | 'test';
  logLevel: string;
  wsBaseUrl: string;
  apiBaseUrl: string;
  openaiApiKey: string;
  corsOrigin: string | string[];
}

export const config: Config = {
  port: parseInt(process.env.PORT || '5000'),
  mongoUri: process.env.DATABASE_URL || 'mongodb://localhost:27017/algo360fx',
  env: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  logLevel: process.env.LOG_LEVEL || 'info',
  wsBaseUrl: process.env.WS_BASE_URL || 'ws://localhost:5000',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  openaiApiKey: process.env.OPENAI_API_KEY,
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || '*'
};
