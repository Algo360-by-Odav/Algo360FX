import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import mongoose from 'mongoose';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema, verifyCodeSchema } from '../schemas/auth.schema';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Store verification codes temporarily (in production, use Redis or similar)
const verificationCodes = new Map<string, { code: string; expires: Date }>();

// Mock email sending for development
const mockSendEmail = async (to: string, code: string): Promise<void> => {
  console.log(`[DEV] Verification code for ${to}: ${code}`);
};

// Send verification code
router.post('/verify/send', 
  body('email').isEmail(),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    verificationCodes.set(email, { code, expires });

    // In development, just log the code
    await mockSendEmail(email, code);

    res.json({ 
      success: true,
      message: 'Verification code sent successfully',
    });
  })
);

// Verify code
router.post('/verify/code',
  validateRequest(verifyCodeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, code } = req.body;
    console.log('Verifying code:', { email, code });
    console.log('Stored codes:', Array.from(verificationCodes.entries()));
    
    const storedData = verificationCodes.get(email);
    console.log('Stored data for email:', storedData);

    if (!storedData) {
      res.status(400).json({ error: 'No verification code found. Please request a new code.' });
      return;
    }

    if (new Date() > storedData.expires) {
      verificationCodes.delete(email);
      res.status(400).json({ error: 'Verification code expired. Please request a new code.' });
      return;
    }

    if (storedData.code !== code) {
      res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
      return;
    }

    res.json({ success: true, message: 'Code verified successfully' });
  })
);

// Register new user
router.post('/register', 
  validateRequest(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    console.log('Registration request body:', { email, firstName, lastName });

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'This email is already registered. Please login or use a different email.' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with default preferences
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        emailVerified: true, // Set to true since we've verified the email
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en',
          riskLevel: 'medium',
          defaultLotSize: 0.01,
          tradingPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY']
        }
      });

      // Save user
      console.log('Saving new user:', { email, firstName, lastName });
      await user.save();
      console.log('User saved successfully');

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      // Remove verification code after successful registration
      verificationCodes.delete(email);

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          preferences: user.preferences
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.name === 'ValidationError') {
        res.status(400).json({
          error: 'Validation Error',
          details: error.errors
        });
        return;
      }
      if (error.code === 11000) {
        res.status(409).json({
          error: 'Email already registered',
          message: 'This email is already in use. Please try a different email or login.'
        });
        return;
      }
      res.status(500).json({
        error: 'Registration failed',
        message: error.message || 'An unexpected error occurred during registration'
      });
      return;
    }
  })
);

// Login user
router.post('/login',
  validateRequest(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          preferences: user.preferences
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: error.message || 'An unexpected error occurred during login'
      });
      return;
    }
  })
);

export default router;
