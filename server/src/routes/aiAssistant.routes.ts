import { Router } from 'express';
import { AIAssistantController } from '../controllers/aiAssistant.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const aiController = new AIAssistantController();

// Chat endpoint
router.post('/chat', authenticateToken, aiController.processChat);

// Market analysis endpoints
router.get('/analysis', authenticateToken, aiController.getMarketAnalysis);
router.get('/prediction', authenticateToken, aiController.getPrediction);
router.get('/signals', authenticateToken, aiController.getTradingSignals);
router.get('/risk', authenticateToken, aiController.getRiskAssessment);

export default router;
