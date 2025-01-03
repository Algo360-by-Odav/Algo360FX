import { AuthService } from '../../services/Auth';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Mock JWT secret
config.jwt.secret = 'test-secret';
config.jwt.refreshSecret = 'test-refresh-secret';

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
      try {
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
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    }, 10000);

    it('should throw error if user already exists', async () => {
      try {
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
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    }, 10000);
  });

  describe('login', () => {
    beforeEach(async () => {
      try {
        await AuthService.register(
          testUser.email,
          testUser.password,
          testUser.username
        );
      } catch (error) {
        console.error('Failed to setup test:', error);
        throw error;
      }
    });

    it('should return tokens for valid credentials', async () => {
      try {
        const result = await AuthService.login(testUser.email, testUser.password);
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        expect(result.user).toBeDefined();
        expect(result.user.email).toBe(testUser.email);

        // Verify tokens are valid
        const decodedAccess = jwt.verify(result.accessToken, config.jwt.secret) as any;
        expect(decodedAccess.userId).toBeDefined();
        
        const decodedRefresh = jwt.verify(result.refreshToken, config.jwt.refreshSecret) as any;
        expect(decodedRefresh.userId).toBeDefined();
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    }, 10000);

    it('should throw error for invalid credentials', async () => {
      try {
        await expect(
          AuthService.login(testUser.email, 'wrongpassword')
        ).rejects.toThrow('Invalid credentials');
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    }, 10000);
  });
});
