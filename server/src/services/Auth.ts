import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/User';
import { config } from '../config/config';

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateTokens(user: IUser) {
    const accessToken = jwt.sign(
      { userId: user._id },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, version: user.tokenVersion },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  static async register(email: string, password: string, username: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      username
    });

    const tokens = this.generateTokens(user);
    return { user, ...tokens };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    return { user, ...tokens };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      const user = await User.findById(decoded.userId);

      if (!user || user.tokenVersion !== decoded.version) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async revokeRefreshTokens(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.tokenVersion += 1;
    await user.save();
    return true;
  }
}
