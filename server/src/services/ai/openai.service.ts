import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class OpenAIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateCompletion(prompt: string): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 1000,
            });

            return response.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Error generating OpenAI completion:', error);
            throw error;
        }
    }

    async generateAnalysis(data: any): Promise<string> {
        try {
            const prompt = `Analyze this market data: ${JSON.stringify(data)}`;
            return await this.generateCompletion(prompt);
        } catch (error) {
            console.error('Error generating analysis:', error);
            throw error;
        }
    }
}

export const openAIService = new OpenAIService();
export default OpenAIService;
