import express, { Response, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  preferences: z.record(z.unknown()).optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

// Get user profile
const getUserProfile: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const userId = authReq.user.id;
    console.log('Fetching profile for user:', userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        status: 'error',
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    console.log('Profile fetched successfully for user:', userId);
    res.json({
      status: 'success',
      data: { user }
    });

  } catch (error: any) {
    console.error('Profile fetch error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({
      status: 'error',
      code: 'PROFILE_FETCH_ERROR',
      message: 'Failed to fetch user profile'
    });
  }
};

// Update user profile
const updateUserProfile: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const userId = authReq.user.id;
    console.log('Updating profile for user:', userId);

    const validatedData = updateUserSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Profile updated successfully for user:', userId);
    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });

  } catch (error: any) {
    console.error('Profile update error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        errors: error.errors
      });
    }

    res.status(500).json({
      status: 'error',
      code: 'PROFILE_UPDATE_ERROR',
      message: 'Failed to update user profile'
    });
  }
});

// Update user preferences
const updateUserPreferences: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const userId = authReq.user.id;
    const preferences = req.body;
    console.log('Updating preferences for user:', userId);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: preferences
      },
      select: {
        id: true,
        preferences: true
      }
    });

    console.log('Preferences updated successfully for user:', userId);
    res.json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: { preferences: updatedUser.preferences }
    });

  } catch (error: any) {
    console.error('Preferences update error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({
      status: 'error',
      code: 'PREFERENCES_UPDATE_ERROR',
      message: 'Failed to update user preferences'
    });
  }
};

// Get user preferences
const getUserPreferences: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const userId = authReq.user.id;
    console.log('Fetching preferences for user:', userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        preferences: true
      }
    });

    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({
        status: 'error',
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    console.log('Preferences fetched successfully for user:', userId);
    res.json({
      status: 'success',
      data: { preferences: user.preferences }
    });

  } catch (error: any) {
    console.error('Preferences fetch error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({
      status: 'error',
      code: 'PREFERENCES_FETCH_ERROR',
      message: 'Failed to fetch user preferences'
    });
  }
};

// Delete user account
const deleteUserAccount: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    await prisma.user.delete({
      where: {
        id: authReq.user.id
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Delete user account error:', error);
    return res.status(500).json({ error: 'Failed to delete user account' });
  }
};

// Routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.put('/preferences', auth, updateUserPreferences);
router.get('/preferences', auth, getUserPreferences);
router.delete('/account', auth, deleteUserAccount);

export { router as userRouter };
