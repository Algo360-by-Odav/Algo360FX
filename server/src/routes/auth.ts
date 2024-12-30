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
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
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
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, code } = req.body;
    console.log('Verifying code:', { email, code });
    console.log('Stored codes:', Array.from(verificationCodes.entries()));
    
    const storedData = verificationCodes.get(email);
    console.log('Stored data for email:', storedData);

    if (!storedData) {
      console.log('No verification code found for email:', email);
      return res.status(400).json({ error: 'No verification code found. Please request a new code.' });
    }

    if (new Date() > storedData.expires) {
      console.log('Code expired. Current time:', new Date(), 'Expiry:', storedData.expires);
      verificationCodes.delete(email);
      return res.status(400).json({ error: 'Verification code expired. Please request a new code.' });
    }

    if (storedData.code !== code) {
      console.log('Code mismatch. Received:', code, 'Stored:', storedData.code);
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    // Don't delete the code yet, it will be deleted after successful registration
    res.json({ success: true, message: 'Code verified successfully' });
  })
);

// Register new user
router.post('/register', 
  validateRequest(registerSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, firstName, lastName } = req.body;
    console.log('Registration request body:', { email, firstName, lastName });

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ error: 'This email is already registered. Please login or use a different email.' });
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
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors
        });
      }
      if (error.code === 11000) {
        return res.status(409).json({
          error: 'Email already registered',
          message: 'This email is already in use. Please try a different email or login.'
        });
      }
      res.status(500).json({
        error: 'Registration failed',
        message: error.message || 'An unexpected error occurred during registration'
      });
    }
  })
);

// Login
router.post('/login',
  validateRequest(loginSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  })
);

// Get user profile
router.get('/profile', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}));

export default router;
