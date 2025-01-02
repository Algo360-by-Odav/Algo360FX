import express, { Response, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import prisma from '../lib/prisma';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Validation schemas
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  currentPassword: Joi.string().min(6).when('newPassword', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  newPassword: Joi.string().min(6),
  preferences: Joi.object()
}).min(1);

// Get user profile
const getUserProfile: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const [user, tradesCount, signalsCount, portfoliosCount] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: authReq.user.id
        },
        select: {
          id: true,
          username: true,
          email: true,
          preferences: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.trade.count({
        where: {
          user: {
            id: authReq.user.id
          }
        }
      }),
      prisma.signal.count({
        where: {
          user: {
            id: authReq.user.id
          }
        }
      }),
      prisma.portfolio.count({
        where: {
          user: {
            id: authReq.user.id
          }
        }
      })
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      ...user,
      _count: {
        trades: tradesCount,
        signals: signalsCount,
        portfolios: portfoliosCount
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

// Update user profile
const updateUserProfile: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { currentPassword, newPassword, ...updateData } = value;

    // If updating password, verify current password
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: authReq.user.id },
        select: { password: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    const [updatedUser, tradesCount, signalsCount, portfoliosCount] = await Promise.all([
      prisma.user.update({
        where: {
          id: authReq.user.id
        },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          preferences: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.trade.count({
        where: {
          user: {
            id: authReq.user.id
          }
        }
      }),
      prisma.signal.count({
        where: {
          user: {
            id: authReq.user.id
          }
        }
      }),
      prisma.portfolio.count({
        where: {
          user: {
            id: authReq.user.id
          }
        }
      })
    ]);

    return res.json({
      ...updatedUser,
      _count: {
        trades: tradesCount,
        signals: signalsCount,
        portfolios: portfoliosCount
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return res.status(500).json({ error: 'Failed to update user profile' });
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
router.delete('/account', auth, deleteUserAccount);

export { router as userRouter };
