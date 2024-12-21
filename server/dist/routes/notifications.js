"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
const mockPreferences = {
    emailNotifications: true,
    pushNotifications: true,
    tradeAlerts: true,
    marketAlerts: true,
    systemAlerts: true,
};
router.get('/', (_req, res) => {
    const page = parseInt(_req.query.page) || 1;
    const limit = parseInt(_req.query.limit) || 20;
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
router.get('/preferences', (_req, res) => {
    res.json(mockPreferences);
});
router.put('/preferences', (req, res) => {
    Object.assign(mockPreferences, req.body);
    res.json(mockPreferences);
});
router.put('/:id/read', (req, res) => {
    const notification = mockNotifications.find(n => n.id === req.params.id);
    if (notification) {
        notification.read = true;
        res.json(notification);
    }
    else {
        res.status(404).json({ error: 'Notification not found' });
    }
});
router.put('/read-all', (_req, res) => {
    mockNotifications.forEach(notification => {
        notification.read = true;
    });
    res.json({ message: 'All notifications marked as read' });
});
router.delete('/:id', (req, res) => {
    const index = mockNotifications.findIndex(n => n.id === req.params.id);
    if (index !== -1) {
        mockNotifications.splice(index, 1);
        res.status(204).send();
    }
    else {
        res.status(404).json({ error: 'Notification not found' });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map