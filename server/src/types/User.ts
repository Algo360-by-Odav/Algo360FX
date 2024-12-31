import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  tokenVersion: number;
  role: 'user' | 'admin';
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: 'en' | 'es' | 'fr' | 'de' | 'zh';
    riskLevel: 'low' | 'medium' | 'high';
    defaultLotSize: number;
    tradingPairs: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
