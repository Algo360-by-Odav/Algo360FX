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
    const { email, password, verificationCode, firstName, lastName } = req.body;
    console.log('Registration request body:', { email, firstName, lastName, verificationCode: '***' });

    try {
      // Check if verification code is valid
      const storedVerification = verificationCodes.get(email);
      console.log('Registration verification check:', {
        email,
        hasStoredCode: !!storedVerification,
        codeExpired: storedVerification ? new Date() > storedVerification.expires : null,
        allEmails: Array.from(verificationCodes.keys())
      });

      if (!storedVerification) {
        console.log('No verification code found for:', email);
        return res.status(400).json({ error: 'Please request a new verification code' });
      }

      if (new Date() > storedVerification.expires) {
        console.log('Verification code expired:', {
          expires: storedVerification.expires,
          now: new Date()
        });
        verificationCodes.delete(email);
        return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
      }

      if (storedVerification.code !== verificationCode) {
        console.log('Verification code mismatch');
        return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ error: 'This email is already registered. Please login or use a different email.' });
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      await user.save();
      console.log('User registered successfully:', email);

      // Clear verification code after successful registration
      verificationCodes.delete(email);

      // Return success without token
      res.status(201).json({
        success: true,
        message: 'Registration successful! Please login to continue.'
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'This email is already registered. Please login or use a different email.' });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Invalid registration data. Please check your input.' });
      }
      next(error);
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
