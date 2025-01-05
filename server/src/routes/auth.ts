import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { prisma } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// Register new user
router.post('/register', 
  validateRequest(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, username, firstName, lastName } = req.body;

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({ 
          status: 'error',
          code: existingUser.email === email ? 'EMAIL_EXISTS' : 'USERNAME_EXISTS',
          message: existingUser.email === email 
            ? 'This email is already registered. Please login or use a different email.'
            : 'This username is already taken. Please choose a different username.'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          firstName: firstName || '',
          lastName: lastName || '',
          emailVerified: true, // Auto-verify for testing
          role: 'USER',
          preferences: { theme: 'light' }
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          emailVerified: true,
          preferences: true
        }
      });

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' } // Extended for testing
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        status: 'success',
        data: {
          user,
          tokens: {
            accessToken,
            refreshToken
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        status: 'error',
        code: 'REGISTRATION_FAILED',
        message: 'Failed to register user. Please try again.'
      });
    }
  })
);

// Login user
router.post('/login',
  validateRequest(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          status: 'error',
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Return success
      res.json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        code: 'LOGIN_FAILED',
        message: 'Failed to login. Please try again.'
      });
    }
  })
);

export default router;
