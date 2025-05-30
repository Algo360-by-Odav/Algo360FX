import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username is taken
    const existingUsername = await this.usersService.findByUsername(registerDto.username);
    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async logout(userId: string, refreshToken: string) {
    // Delete the refresh token from database
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });
    
    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Find the refresh token in the database
      const refreshTokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshTokenDto.refreshToken },
        include: { user: true },
      });

      // Check if token exists and is valid
      if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Delete the used refresh token (optional, for increased security)
      await this.prisma.refreshToken.delete({
        where: { id: refreshTokenRecord.id },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(refreshTokenRecord.user.id, refreshTokenRecord.user.email);

      return {
        ...tokens,
        user: {
          id: refreshTokenRecord.user.id,
          email: refreshTokenRecord.user.email,
          username: refreshTokenRecord.user.username,
          firstName: refreshTokenRecord.user.firstName,
          lastName: refreshTokenRecord.user.lastName,
          role: refreshTokenRecord.user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    // Generate access token
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      {
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') || '15m',
      },
    );

    // Generate refresh token
    const refreshToken = uuidv4();
    
    // Calculate expiration date (e.g., 7 days from now)
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION') || '7d';
    const expiresAt = new Date();
    if (expiresIn.endsWith('d')) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn.slice(0, -1)));
    } else if (expiresIn.endsWith('h')) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn.slice(0, -1)));
    } else {
      // Default to 7 days
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') || '15m',
    };
  }
}
