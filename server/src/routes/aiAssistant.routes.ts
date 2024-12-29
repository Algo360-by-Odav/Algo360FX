import { Router } from 'express';
import { AIAssistantController } from '../controllers/aiAssistant.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const aiController = new AIAssistantController();

// AI Assistant endpoints
router.post('/chat', authenticateToken, (req, res) => aiController.chat(req, res));

export default router;
