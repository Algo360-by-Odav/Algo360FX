import express, { Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../models/User';
import mongoose from 'mongoose';

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
  checkSchema({
    email: {
      isEmail: true,
      errorMessage: 'Please enter a valid email'
    }
  }),
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
  checkSchema({
    email: {
      isEmail: true,
      errorMessage: 'Please enter a valid email'
    },
    code: {
      isLength: {
        options: { min: 6, max: 6 },
        errorMessage: 'Verification code must be 6 digits long'
      }
    }
  }),
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
  checkSchema({
    email: {
      isEmail: true,
      errorMessage: 'Please enter a valid email'
    },
    password: {
      isLength: {
        options: { min: 8 },
        errorMessage: 'Password must be at least 8 characters long'
      }
    },
    firstName: {
      notEmpty: true,
      errorMessage: 'First name is required'
    },
    lastName: {
      notEmpty: true,
      errorMessage: 'Last name is required'
    },
    verificationCode: {
      notEmpty: true,
      errorMessage: 'Verification code is required'
    }
  }),
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
        { id: user._id, email: user.email },
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
  checkSchema({
    email: {
      isEmail: true,
      errorMessage: 'Please enter a valid email'
    },
    password: {
      exists: true,
      errorMessage: 'Password is required'
    }
  }),
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
        { id: user._id, email: user.email },
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

export default router;
