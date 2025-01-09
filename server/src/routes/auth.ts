import { Router } from 'express';
import { AuthService } from '../services-new/Auth';
import { authenticateToken, validateRequest } from '../middleware';
import { CreateUserInput, UpdateUserInput } from '../types-new/User';

const router = Router();
const authService = new AuthService();

// Register a new user
router.post('/register', validateRequest, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const input: CreateUserInput = { email, password, firstName, lastName };
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'User already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user!.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/me', authenticateToken, validateRequest, async (req, res) => {
  try {
    const input: UpdateUserInput = req.body;
    const user = await authService.updateUser(req.user!.id, input);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid current password') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Request password reset
router.post('/request-reset', validateRequest, async (req, res) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request password reset' });
  }
});

// Reset password
router.post('/reset-password', validateRequest, async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid or expired token') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await authService.logout(req.user!.id);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export default router;
