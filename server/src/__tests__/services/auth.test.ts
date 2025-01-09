import { AuthService } from '../../services/Auth';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import dotenv from 'dotenv';
import { TokenExpiredError } from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Mock JWT secret
config.jwt.secret = 'test-secret';
config.jwt.refreshSecret = 'test-refresh-secret';
config.jwt.accessExpiresIn = '15m';
config.jwt.refreshExpiresIn = '7d';

describe('AuthService', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testPassword123',
    username: 'testuser'
  };

  beforeEach(async () => {
    try {
      await User.deleteMany({});
    } catch (error) {
      console.error('Failed to clean up test data:', error);
      throw error;
    }
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const result = await AuthService.register(
        testUser.email,
        testUser.password,
        testUser.username
      );
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.username).toBe(testUser.username);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      // Verify the user was actually saved
      const savedUser = await User.findOne({ email: testUser.email });
      expect(savedUser).toBeDefined();
      expect(savedUser?.email).toBe(testUser.email);
      expect(savedUser?.password).not.toBe(testUser.password); // Password should be hashed
    });

    it('should throw error if user already exists', async () => {
      await AuthService.register(
        testUser.email,
        testUser.password,
        testUser.username
      );
      await expect(
        AuthService.register(
          testUser.email,
          testUser.password,
          testUser.username
        )
      ).rejects.toThrow('User already exists');
    });

    it('should throw error for invalid email format', async () => {
      await expect(
        AuthService.register('invalidemail', testUser.password, testUser.username)
      ).rejects.toThrow('Invalid email format');
    });

    it('should throw error for weak password', async () => {
      await expect(
        AuthService.register(testUser.email, 'weak', testUser.username)
      ).rejects.toThrow('Password must be at least 8 characters');
    });

    it('should throw error for invalid username', async () => {
      await expect(
        AuthService.register(testUser.email, testUser.password, 'a')
      ).rejects.toThrow('Username must be between 3 and 30 characters');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await AuthService.register(
        testUser.email,
        testUser.password,
        testUser.username
      );
    });

    it('should return tokens for valid credentials', async () => {
      const result = await AuthService.login(testUser.email, testUser.password);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(testUser.email);

      // Verify tokens are valid
      const decodedAccess = jwt.verify(result.accessToken, config.jwt.secret) as any;
      expect(decodedAccess.userId).toBeDefined();
      expect(decodedAccess.type).toBe('access');
      
      const decodedRefresh = jwt.verify(result.refreshToken, config.jwt.refreshSecret) as any;
      expect(decodedRefresh.userId).toBeDefined();
      expect(decodedRefresh.type).toBe('refresh');
    });

    it('should throw error for invalid credentials', async () => {
      await expect(
        AuthService.login(testUser.email, 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        AuthService.login('nonexistent@example.com', testUser.password)
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    let validRefreshToken: string;

    beforeEach(async () => {
      const result = await AuthService.register(
        testUser.email,
        testUser.password,
        testUser.username
      );
      validRefreshToken = result.refreshToken;
    });

    it('should generate new access token with valid refresh token', async () => {
      const result = await AuthService.refreshToken(validRefreshToken);
      expect(result.accessToken).toBeDefined();
      
      const decoded = jwt.verify(result.accessToken, config.jwt.secret) as any;
      expect(decoded.userId).toBeDefined();
      expect(decoded.type).toBe('access');
    });

    it('should throw error for invalid refresh token', async () => {
      await expect(
        AuthService.refreshToken('invalid-token')
      ).rejects.toThrow('Invalid token');
    });

    it('should throw error for expired refresh token', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test-id', type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: '0s' }
      );

      await expect(
        AuthService.refreshToken(expiredToken)
      ).rejects.toThrow(TokenExpiredError);
    });
  });

  describe('validateToken', () => {
    let validAccessToken: string;

    beforeEach(async () => {
      const result = await AuthService.register(
        testUser.email,
        testUser.password,
        testUser.username
      );
      validAccessToken = result.accessToken;
    });

    it('should return true for valid access token', async () => {
      const isValid = await AuthService.validateToken(validAccessToken);
      expect(isValid).toBe(true);
    });

    it('should throw error for invalid token', async () => {
      await expect(
        AuthService.validateToken('invalid-token')
      ).rejects.toThrow('Invalid token');
    });

    it('should throw error for expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test-id', type: 'access' },
        config.jwt.secret,
        { expiresIn: '0s' }
      );

      await expect(
        AuthService.validateToken(expiredToken)
      ).rejects.toThrow(TokenExpiredError);
    });
  });

  describe('logout', () => {
    let validRefreshToken: string;
    let userId: string;

    beforeEach(async () => {
      const result = await AuthService.register(
        testUser.email,
        testUser.password,
        testUser.username
      );
      validRefreshToken = result.refreshToken;
      userId = result.user.id;
    });

    it('should successfully logout user', async () => {
      await expect(
        AuthService.logout(userId, validRefreshToken)
      ).resolves.not.toThrow();
    });

    it('should throw error for invalid refresh token', async () => {
      await expect(
        AuthService.logout(userId, 'invalid-token')
      ).rejects.toThrow('Invalid token');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        AuthService.logout('non-existent-id', validRefreshToken)
      ).rejects.toThrow('User not found');
    });
  });
});
