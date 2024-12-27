import express, { Request, Response } from 'express';
const { body, validationResult } = require('express-validator');
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../models/User';
import mongoose from 'mongoose';
import { authLimiter, verificationLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Store verification codes temporarily (in production, use Redis or similar)
const verificationCodes = new Map<string, { code: string; expires: Date }>();

// Mock email sending for development
const mockSendEmail = async (to: string, code: string) => {
  console.log(`[DEV] Verification code for ${to}: ${code}`);
  return Promise.resolve();
};

// Send verification code
router.post('/verify/send', 
  verificationLimiter,
  body('email').isEmail().withMessage('Please enter a valid email'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      verificationCodes.set(email, { code, expires });

      // In development, just log the code
      await mockSendEmail(email, code);

      return res.json({ 
        success: true,
        message: 'Verification code sent successfully',
      });
    } catch (error) {
      console.error('Error sending verification code:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to send verification code'
      });
    }
  }
);

// Verify code
router.post('/verify/code',
  authLimiter,
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits long'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, code } = req.body;
      console.log('Verifying code:', { email, code });
      console.log('Stored codes:', Array.from(verificationCodes.entries()));
      
      const storedData = verificationCodes.get(email);
      console.log('Stored data for email:', storedData);

      if (!storedData) {
        console.log('No verification code found for email:', email);
        return res.status(400).json({ error: 'No verification code found' });
      }

      if (new Date() > storedData.expires) {
        console.log('Code expired. Current time:', new Date(), 'Expiry:', storedData.expires);
        verificationCodes.delete(email);
        return res.status(400).json({ error: 'Verification code expired' });
      }

      if (storedData.code !== code) {
        console.log('Code mismatch. Received:', code, 'Stored:', storedData.code);
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      return res.json({ success: true, message: 'Code verified successfully' });
    } catch (error) {
      console.error('Error verifying code:', error);
      return res.status(500).json({ error: 'Failed to verify code' });
    }
  }
);

// Register new user
router.post('/register',
  authLimiter,
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('verificationCode').notEmpty().withMessage('Verification code is required'),
  async (req: Request, res: Response) => {
    console.log('Registration request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Registration validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, firstName, lastName, verificationCode } = req.body;

      // Verify the verification code first
      const storedData = verificationCodes.get(email);
      console.log('Registration verification check:', {
        email,
        verificationCode,
        storedData,
        allStoredCodes: Array.from(verificationCodes.entries())
      });
      
      if (!storedData || storedData.code !== verificationCode) {
        console.log('Invalid verification code during registration');
        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Save user to database
      try {
        await user.save();
        console.log('User saved successfully:', email);
      } catch (saveError: any) {
        console.error('Error saving user:', {
          error: saveError.message,
          code: saveError.code,
          keyPattern: saveError.keyPattern,
          keyValue: saveError.keyValue
        });
        throw saveError;
      }

      // Clear verification code
      verificationCodes.delete(email);

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id.toString(),
          _id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      });
      
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      
      if (error.code === 11000) {  // Duplicate key error
        return res.status(400).json({ error: 'User already exists' });
      }
      
      return res.status(500).json({ error: 'Failed to register user' });
    }
  }
);

// Login
router.post('/login',
  authLimiter,
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: user._id.toString(),
          _id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Failed to login' });
    }
  }
);

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Get current authenticated user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Reset password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Verify reset token
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired (24 hours)
    const now = new Date();
    if (!user.resetPasswordExpires || user.resetPasswordExpires < now) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined
        }
      }
    );

    return res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
