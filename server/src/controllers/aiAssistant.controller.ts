import { Request, Response } from 'express';
import { AIAssistantService } from '../services/aiAssistant.service';

export class AIAssistantController {
  private aiService: AIAssistantService;

  constructor() {
    this.aiService = new AIAssistantService();
  }

  async chat(req: Request, res: Response) {
    try {
      const { message, context } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await this.aiService.processChat(message, context);
      return res.json(response);
    } catch (error) {
      console.error('Error in AI chat:', error);
      return res.status(500).json({
        error: 'An error occurred while processing your request'
      });
    }
  }
}
