import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Register new user
router.post('/register', 
  validateRequest(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      console.log('Registration attempt:', { email, firstName, lastName });

      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(409).json({ 
          status: 'error',
          code: 'USER_EXISTS',
          message: 'This email is already registered. Please login or use a different email.'
        });
      }

      // Additional validation
      if (password.length < 8) {
        console.log('Invalid password length');
        return res.status(400).json({
          status: 'error',
          code: 'INVALID_PASSWORD',
          message: 'Password must be at least 8 characters long'
        });
      }

      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      console.log('Creating new user...');
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        emailVerified: true, // Set to true by default for development
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en',
          riskLevel: 'medium',
          defaultLotSize: 0.01,
          tradingPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY']
        }
      });

      console.log('Saving user to database...');
      await user.save();

      console.log('Generating JWT token...');
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      console.log('Registration successful:', email);
      return res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: true
          },
          token
        }
      });

    } catch (error: any) {
      console.error('Registration error details:', {
        error: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name
      });
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        return res.status(409).json({
          status: 'error',
          code: 'USER_EXISTS',
          message: 'This email is already registered. Please login or use a different email.'
        });
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 'error',
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          errors: Object.values(error.errors).map((err: any) => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      return res.status(500).json({
        status: 'error',
        code: 'REGISTRATION_FAILED',
        message: 'Registration failed. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      console.log('Login attempt:', email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found:', email);
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      console.log('Login successful:', email);
      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: user.emailVerified
          },
          token
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed. Please try again later.' });
    }
  })
);

export default router;
