import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../models/User';
import { authLimiter, verificationLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Store verification codes temporarily (in production, use Redis or similar)
const verificationCodes = new Map<string, { code: string; expires: Date }>();

// Mock email sending for development
const mockSendEmail = async (to: string, code: string) => {
  console.log(`[DEV] Verification code for ${to}: ${code}`);
  return Promise.resolve();
};

// Enable CORS for auth routes
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Send verification code
router.post('/verify/send', 
  verificationLimiter,
  body('email').isEmail().withMessage('Please enter a valid email'),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { email } = req.body;
      console.log('Received verification code request for email:', email);

      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      verificationCodes.set(email, { code, expires });
      console.log('Generated code:', code, 'expires:', expires);

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
        error: 'Failed to send verification code. Please try again.'
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { email, code } = req.body;
      console.log('Verifying code for email:', email, 'code:', code);

      const storedData = verificationCodes.get(email);
      if (!storedData) {
        return res.status(400).json({ 
          success: false,
          error: 'No verification code found. Please request a new code.' 
        });
      }

      if (new Date() > storedData.expires) {
        verificationCodes.delete(email);
        return res.status(400).json({ 
          success: false,
          error: 'Verification code has expired. Please request a new code.' 
        });
      }

      if (storedData.code !== code) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid verification code. Please try again.' 
        });
      }

      return res.json({ 
        success: true, 
        message: 'Code verified successfully' 
      });
    } catch (error) {
      console.error('Error verifying code:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to verify code. Please try again.' 
      });
    }
  }
);

// Register new user
router.post('/register',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('verificationCode').isLength({ min: 6, max: 6 }).withMessage('Valid verification code is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { email, password, firstName, lastName, verificationCode } = req.body;

      // Verify the code again
      const storedData = verificationCodes.get(email);
      if (!storedData || storedData.code !== verificationCode || new Date() > storedData.expires) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid or expired verification code' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          error: 'Email is already registered' 
        });
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
        isVerified: true
      });

      await user.save();
      verificationCodes.delete(email); // Clean up the verification code

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Registration failed. Please try again.' 
      });
    }
  }
);

// Login
router.post('/login',
  authLimiter,
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required'),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid credentials' 
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid credentials' 
        });
      }

      const token = jwt.sign(
        { 
          userId: user._id,
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
      return res.status(500).json({ 
        success: false,
        error: 'Failed to login. Please try again.' 
      });
    }
  }
);

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string; email: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    return res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(401).json({ 
      success: false,
      error: 'Invalid token' 
    });
  }
});

// Get current authenticated user
router.get('/me', async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    return res.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(401).json({ 
      success: false,
      error: 'Invalid token' 
    });
  }
});

// Reset password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Token and new password are required' 
      });
    }

    // Verify reset token
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired reset token' 
      });
    }

    // Check if token is expired (24 hours)
    const now = new Date();
    if (!user.resetPasswordExpires || user.resetPasswordExpires < now) {
      return res.status(400).json({ 
        success: false,
        error: 'Reset token has expired' 
      });
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

    return res.json({ 
      success: true,
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to reset password. Please try again.' 
    });
  }
});

export default router;
