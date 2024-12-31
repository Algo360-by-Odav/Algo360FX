import { Router, Request, Response } from 'express';
import { AsyncRequestHandler } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { UserService } from '../services/User';
import { AuthService } from '../services/Auth';
import { config } from '../config/config';

const router = Router();
const userService = new UserService();
const authService = new AuthService();

// Register new user
router.post('/register', 
  validateRequest(registerSchema),
  ((async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      console.log('Registration attempt:', { email, firstName, lastName });

      // Check if user already exists
      const existingUser = await UserService.getUserByEmail(email);
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ 
          status: 'error',
          code: 'USER_EXISTS',
          message: 'This email is already registered. Please login or use a different email.'
        });
      }

      // Create new user
      const user = await UserService.createUser({
        email,
        password,
        firstName,
        lastName
      });

      // Generate tokens
      const { accessToken, refreshToken } = await AuthService.generateTokens(user);

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
  }) as AsyncRequestHandler)
);

// Login user
router.post('/login',
  validateRequest(loginSchema),
  ((async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      console.log('Login attempt:', email);

      // Validate credentials
      const { user, accessToken, refreshToken } = await AuthService.login(email, password);
      if (!user) {
        console.log('Invalid credentials:', email);
        return res.status(401).json({ 
          status: 'error',
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        });
      }

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
  }) as AsyncRequestHandler)
);

export default router;
