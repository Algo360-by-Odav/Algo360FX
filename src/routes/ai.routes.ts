import { Router } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';
import { validateRequest } from '@/middleware/validateRequest';
import { config } from '@/config/config';

const router = Router();
const openai = new OpenAI({ apiKey: config.openaiApiKey });

const analyzeRequestSchema = z.object({
  body: z.object({
    text: z.string().min(1),
    type: z.enum(['sentiment', 'market', 'news'])
  })
});

router.post('/analyze', validateRequest(analyzeRequestSchema), async (req, res) => {
  try {
    const { text, type } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specialized in ${type} analysis. Analyze the following text and provide insights.`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

export default router;
