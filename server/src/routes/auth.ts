import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// Register new user
router.post('/register', 
  validateRequest(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      console.log('Registration attempt:', { email, firstName, lastName });

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ 
          status: 'error',
          code: 'USER_EXISTS',
          message: 'This email is already registered. Please login or use a different email.'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          username: email.split('@')[0], // Default username from email
          role: 'USER',
          emailVerified: false,
          tokenVersion: 0,
          preferences: {}
        }
      });

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: user.id, version: user.tokenVersion },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      // Set refresh token cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      console.log('Registration successful:', email);
      res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          },
          accessToken
        }
      });

    } catch (error: any) {
      console.error('Registration error details:', {
        error: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name
      });
      
      res.status(500).json({
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

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ 
          status: 'error',
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log('Invalid password:', email);
        return res.status(401).json({ 
          status: 'error',
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: user.id, version: user.tokenVersion },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      // Set refresh token cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      console.log('Login successful:', email);
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          },
          accessToken
        }
      });
    } catch (error: any) {
      console.error('Login error details:', {
        error: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name
      });
      
      res.status(500).json({
        status: 'error',
        code: 'LOGIN_FAILED',
        message: 'Login failed. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  })
);

export default router;
