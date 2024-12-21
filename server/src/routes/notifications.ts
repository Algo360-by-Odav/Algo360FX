import express, { Request, Response } from 'express';
// import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'info',
    title: 'Market Update',
    message: 'EURUSD has reached your price alert level',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Trade Executed',
    message: 'Buy order for GBPUSD executed successfully',
    timestamp: new Date(),
    read: false,
  },
];

// Mock data for preferences
const mockPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  tradeAlerts: true,
  marketAlerts: true,
  systemAlerts: true,
};

// Get notifications with pagination
router.get('/', (_req: Request, res: Response) => {
  const page = parseInt(_req.query.page as string) || 1;
  const limit = parseInt(_req.query.limit as string) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedNotifications = mockNotifications.slice(startIndex, endIndex);

  res.json({
    notifications: paginatedNotifications,
    total: mockNotifications.length,
    currentPage: page,
    totalPages: Math.ceil(mockNotifications.length / limit),
  });
});

// Get notification preferences
router.get('/preferences', (_req: Request, res: Response) => {
  res.json(mockPreferences);
});

// Update notification preferences
router.put('/preferences', (req: Request, res: Response) => {
  Object.assign(mockPreferences, req.body);
  res.json(mockPreferences);
});

// Mark notification as read
router.put('/:id/read', (req: Request, res: Response) => {
  const notification = mockNotifications.find(n => n.id === req.params.id);
  if (notification) {
    notification.read = true;
    res.json(notification);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

// Mark all notifications as read
router.put('/read-all', (_req: Request, res: Response) => {
  mockNotifications.forEach(notification => {
    notification.read = true;
  });
  res.json({ message: 'All notifications marked as read' });
});

// Delete notification
router.delete('/:id', (req: Request, res: Response) => {
  const index = mockNotifications.findIndex(n => n.id === req.params.id);
  if (index !== -1) {
    mockNotifications.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

export default router;
