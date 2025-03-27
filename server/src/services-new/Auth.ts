import { PrismaClient, Prisma, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils-new/jwt';
import { User, CreateUserInput, UpdateUserInput, AuthResponse } from '../types-new/User';
import { PositionType, PositionStatus } from '../types-new/Position';
import { AuthError } from '../utils-new/errors';
import { UserModel } from '../models-new/User';

export class AuthService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  private transformPosition(position: any) {
    return {
      ...position,
      type: position.type as PositionType,
      status: position.status as PositionStatus
    };
  }

  private transformPortfolio(portfolio: any) {
    return {
      ...portfolio,
      positions: portfolio.positions?.map((pos: any) => this.transformPosition(pos)) || []
    };
  }

  private transformUser(user: any): User {
    return {
      ...user,
      portfolios: user.portfolios?.map((p: any) => this.transformPortfolio(p)) || []
    };
  }

  async register(input: CreateUserInput): Promise<AuthResponse> {
    const existingUser = await UserModel.findByEmail(input.email);

    if (existingUser) {
      throw new AuthError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const userData = {
      email: input.email,
      password: hashedPassword,
      username: input.username || input.email.split('@')[0],
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      preferences: input.preferences || { theme: 'light' }
    };

    const user = await UserModel.create(userData);
    const transformedUser = this.transformUser(user);

    return {
      user: transformedUser,
      accessToken: generateAccessToken(transformedUser),
      refreshToken: generateRefreshToken(transformedUser)
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(email);

    if (!user || !user.password) {
      throw new AuthError('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AuthError('Invalid credentials');
    }

    const transformedUser = this.transformUser(user);
    return {
      user: transformedUser,
      accessToken: generateAccessToken(transformedUser),
      refreshToken: generateRefreshToken(transformedUser)
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
    const transformedUser = this.transformUser(updatedUser);

    return {
      user: transformedUser,
      accessToken: generateAccessToken(transformedUser),
      refreshToken: generateRefreshToken(transformedUser)
    };
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    return this.transformUser(user);
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    const updateData: Prisma.UserUpdateInput = {
      email: input.email,
      username: input.username,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      emailVerified: input.emailVerified,
      tokenVersion: input.tokenVersion,
      preferences: input.preferences || Prisma.JsonNull
    };

    if (input.password) {
      updateData.password = await bcrypt.hash(input.password, 10);
    }

    const updatedUser = await UserModel.update(userId, updateData);
    return this.transformUser(updatedUser);
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

    if (!user || !user.password) {
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
