import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export class AuthService {
  async validateCredentials(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async generateTokens(user: any) {
    const accessToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      },
      config.jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user._id,
        tokenVersion: user.tokenVersion || 0
      },
      config.jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
      const user = await User.findById(payload.userId);

      if (!user || user.tokenVersion !== payload.tokenVersion) {
        return null;
      }

      const accessToken = jwt.sign(
        { 
          userId: user._id, 
          email: user.email 
        },
        config.jwtSecret,
        { expiresIn: '15m' }
      );

      return { accessToken };
    } catch {
      return null;
    }
  }

  async revokeRefreshTokens(userId: string) {
    await User.findByIdAndUpdate(userId, {
      $inc: { tokenVersion: 1 }
    });
  }
}
