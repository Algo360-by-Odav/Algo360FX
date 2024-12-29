import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import mongoose from 'mongoose';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
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
  [
    body('email').isEmail(),
    body('code').isLength({ min: 6, max: 6 }),
  ],
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      res.status(400).json({ errors: errors.array() });
    }

    const { email, code } = req.body;
    console.log('Verifying code:', { email, code });
    console.log('Stored codes:', Array.from(verificationCodes.entries()));
    
    const storedData = verificationCodes.get(email);
    console.log('Stored data for email:', storedData);

    if (!storedData) {
      console.log('No verification code found for email:', email);
      res.status(400).json({ error: 'No verification code found' });
    }

    if (new Date() > storedData.expires) {
      console.log('Code expired. Current time:', new Date(), 'Expiry:', storedData.expires);
      verificationCodes.delete(email);
      res.status(400).json({ error: 'Verification code expired' });
    }

    if (storedData.code !== code) {
      console.log('Code mismatch. Received:', code, 'Stored:', storedData.code);
      res.status(400).json({ error: 'Invalid verification code' });
    }

    res.json({ success: true, message: 'Code verified successfully' });
  })
);

// Register new user
router.post('/register', 
  validateRequest(registerSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, verificationCode } = req.body;

    try {
      // Check if verification code is valid
      const storedVerification = verificationCodes.get(email);
      if (!storedVerification || storedVerification.code !== verificationCode) {
        res.status(400).json({ error: 'Invalid verification code' });
      }

      if (storedVerification.expires < new Date()) {
        verificationCodes.delete(email);
        res.status(400).json({ error: 'Verification code has expired' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email }).exec();

      if (existingUser) {
        res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        email,
        password: hashedPassword,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await user.save();

      // Remove verification code after successful registration
      verificationCodes.delete(email);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ error: 'Invalid user data', details: error.errors });
      }
      
      if (error.message === 'Database operation timed out') {
        res.status(503).json({ 
          error: 'Service temporarily unavailable',
          message: 'Database operation timed out. Please try again.'
        });
      }

      if (error.code === 11000) { // Duplicate key error
        res.status(400).json({ error: 'User already exists' });
      }

      res.status(500).json({ 
        error: 'Registration failed',
        message: 'An unexpected error occurred during registration. Please try again.'
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
