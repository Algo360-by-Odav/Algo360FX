import { Request } from 'express';
import { User } from './User';

export interface AuthRequest extends Request {
  user?: User;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
  tokenVersion: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
