import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
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
    const storedData = verificationCodes.get(email);

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

    try {
      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ 
          status: 'error',
          code: 'USER_EXISTS',
          message: 'This email is already registered. Please login or use a different email.'
        });
      }

      // Additional validation
      if (password.length < 8) {
        return res.status(400).json({
          status: 'error',
          code: 'INVALID_PASSWORD',
          message: 'Password must be at least 8 characters long'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        emailVerified: false,
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en',
          riskLevel: 'medium',
          defaultLotSize: 0.01,
          tradingPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY']
        }
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: false
          },
          token
        }
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      
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
      res.status(500).json({
        error: 'Login failed',
        message: error.message || 'An unexpected error occurred during login'
      });
    }
  })
);

export default router;
