import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils-new/jwt';
import { User, CreateUserInput, UpdateUserInput, AuthResponse } from '../types-new/User';
import { AuthError } from '../utils-new/errors';
import { UserModel } from '../models-new/User';

export class AuthService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async register(input: CreateUserInput): Promise<AuthResponse> {
    const existingUser = await UserModel.findByEmail(input.email);

    if (existingUser) {
      throw new AuthError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await UserModel.create({
      ...input,
      password: hashedPassword,
      username: input.username || input.email.split('@')[0]
    });

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AuthError('Invalid credentials');
    }

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const payload = verifyRefreshToken(token);
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new AuthError('Token version mismatch');
    }

    const updatedUser = await UserModel.updateTokenVersion(user.id);

    return {
      user: updatedUser,
      accessToken: generateAccessToken(updatedUser),
      refreshToken: generateRefreshToken(updatedUser)
    };
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    return user;
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    if (input.password) {
      input.password = await bcrypt.hash(input.password, 10);
    }

    return UserModel.update(userId, input);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      throw new AuthError('User not found');
    }

    // Generate reset token using the refresh token mechanism
    const resetToken = generateRefreshToken(user);

    // In a real application, you would send this token via email
    // For now, we'll just log it
    console.log('Reset token generated:', resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const payload = verifyRefreshToken(token);
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.update(user.id, { password: hashedPassword });
  }

  async logout(userId: string): Promise<void> {
    await UserModel.updateTokenVersion(userId);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      throw new AuthError('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.update(userId, { password: hashedPassword });
  }
}

export default AuthService;
