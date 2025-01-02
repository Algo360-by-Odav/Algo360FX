import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { UserService } from '../services/User';
import { AuthRequest } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { updateUserSchema } from '../schemas/user.schema';
import { RouteBuilder } from '../utils/routeBuilder';
import { handleError } from '../utils/routeHandler';

// Get user profile
const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const user = await UserService.getUserById(userId);
    res.json(user);
  } catch (error) {
    handleError(error);
  }
};

// Update user profile
const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const updates = req.body;
    const user = await UserService.updateUser(userId, updates);
    res.json(user);
  } catch (error) {
    handleError(error);
  }
};

// Update user preferences
const updatePreferences: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const preferences = req.body;
    const user = await UserService.updatePreferences(userId, preferences);
    res.json(user);
  } catch (error) {
    handleError(error);
  }
};

// Delete user account
const deleteAccount: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    await UserService.deleteUser(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    handleError(error);
  }
};

// Create router with RouteBuilder
const router = new RouteBuilder()
  .use(auth)
  .get('/profile', getProfile)
  .put('/profile', validateRequest(updateUserSchema), updateProfile)
  .put('/preferences', updatePreferences)
  .delete('/account', deleteAccount)
  .build();

export { router as userRouter };
