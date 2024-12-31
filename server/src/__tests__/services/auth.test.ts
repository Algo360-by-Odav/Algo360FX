import { AuthService } from '../../services/Auth';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Load environment variables
dotenv.config();

// Mock JWT secret
process.env.JWT_SECRET = 'test-secret';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('AuthService', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testPassword123',
    username: 'testuser'
  };

  beforeEach(async () => {
    await User.deleteMany({});
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
      ).rejects.toThrow();
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
    });

    it('should throw error for invalid credentials', async () => {
      await expect(
        AuthService.login(testUser.email, 'wrongpassword')
      ).rejects.toThrow();
    });
  });
});
