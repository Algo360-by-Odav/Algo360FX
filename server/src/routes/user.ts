import express from 'express';
import { auth } from '../middleware/auth';
import { UserService } from '../services/User';
import { AsyncRequestHandler } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { updateUserSchema } from '../schemas/user.schema';

const router = express.Router();

// Get user profile
const getProfile: AsyncRequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await UserService.getUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Update user profile
const updateProfile: AsyncRequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const updates = req.body;
    const user = await UserService.updateUser(userId, updates);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// Update user preferences
const updatePreferences: AsyncRequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const preferences = req.body;
    const user = await UserService.updatePreferences(userId, preferences);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user preferences' });
  }
};

// Delete user account
const deleteAccount: AsyncRequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    await UserService.deleteUser(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user account' });
  }
};

// Register routes
router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateUserSchema), updateProfile);
router.put('/preferences', updatePreferences);
router.delete('/account', deleteAccount);

export { router as userRouter };
