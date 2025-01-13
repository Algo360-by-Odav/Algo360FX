import { sign, verify } from 'jsonwebtoken';
import { User } from '../types-new/User';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  tokenVersion?: number;
}

export function generateAccessToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return sign(payload, accessTokenSecret, { expiresIn: '15m' });
}

export function generateRefreshToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };

  return sign(payload, refreshTokenSecret, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return verify(token, accessTokenSecret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return verify(token, refreshTokenSecret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
