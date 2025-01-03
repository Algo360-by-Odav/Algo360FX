import express, { Response, Request, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  preferences: z.any().optional(), // Using any for now since it's JSON
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

// Get user profile
const getUserProfile: RequestHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        preferences: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Update user profile
const updateUserProfile: RequestHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = updateUserSchema.parse(req.body);
    
    const updatedUser = await prisma.user.update({
      where: { id: authReq.user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        preferences: validatedData.preferences as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        preferences: true,
      },
    });

    return res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Get user preferences
const getUserPreferences: RequestHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id },
      select: {
        preferences: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user.preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
};

// Delete user account
const deleteUserAccount: RequestHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.user.delete({
      where: { id: authReq.user.id }
    });

    return res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
};

// Update user preferences
const updateUserPreferences: RequestHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const preferences = req.body;
    console.log('Updating preferences for user:', authReq.user.id);

    const updatedUser = await prisma.user.update({
      where: { id: authReq.user.id },
      data: {
        preferences: preferences as Prisma.InputJsonValue
      },
      select: {
        preferences: true
      }
    });

    return res.json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: { preferences: updatedUser.preferences }
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return res.status(500).json({ error: 'Failed to update preferences' });
  }
};

// Routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.put('/preferences', auth, updateUserPreferences);
router.get('/preferences', auth, getUserPreferences);
router.delete('/account', auth, deleteUserAccount);

export default router;
