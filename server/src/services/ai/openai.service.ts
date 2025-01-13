import OpenAI from 'openai';
import dotenv from 'dotenv';
import { prisma } from '../../config/database';
import { AIResponse } from '@prisma/client';

dotenv.config();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface GenerateOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    userId: string;
    useCache?: boolean;
}

class OpenAIService {
    private openai: OpenAI;
    private defaultModel = "gpt-4";

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    private async getCachedResponse(prompt: string, model: string): Promise<AIResponse | null> {
        const cachedResponse = await prisma.aIResponse.findUnique({
            where: {
                prompt_model: {
                    prompt,
                    model,
                },
            },
        });

        if (cachedResponse && Date.now() - cachedResponse.createdAt.getTime() < CACHE_DURATION) {
            return cachedResponse;
        }

        return null;
    }

    private async saveResponse(
        prompt: string,
        response: string,
        model: string,
        userId: string
    ): Promise<AIResponse> {
        return prisma.aIResponse.upsert({
            where: {
                prompt_model: {
                    prompt,
                    model,
                },
            },
            update: {
                response,
                updatedAt: new Date(),
            },
            create: {
                prompt,
                response,
                model,
                createdBy: userId,
            },
        });
    }

    async generateCompletion(
        prompt: string,
        options: GenerateOptions
    ): Promise<string> {
        try {
            const model = options.model || this.defaultModel;

            if (options.useCache !== false) {
                const cachedResponse = await this.getCachedResponse(prompt, model);
                if (cachedResponse) {
                    return cachedResponse.response;
                }
            }

            const response = await this.openai.chat.completions.create({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 1000,
            });

            const content = response.choices[0]?.message?.content || '';
            
            if (content && options.useCache !== false) {
                await this.saveResponse(prompt, content, model, options.userId);
            }

            return content;
        } catch (error) {
            console.error('Error generating OpenAI completion:', error);
            throw error;
        }
    }

    async generateAnalysis(
        data: any,
        userId: string,
        options: Partial<GenerateOptions> = {}
    ): Promise<string> {
        try {
            const prompt = `Analyze this market data: ${JSON.stringify(data)}`;
            return await this.generateCompletion(prompt, {
                ...options,
                userId,
                model: options.model || "gpt-4",
                temperature: options.temperature || 0.7,
                maxTokens: options.maxTokens || 2000,
            });
        } catch (error) {
            console.error('Error generating analysis:', error);
            throw error;
        }
    }

    async cleanupOldResponses(maxAge: number = CACHE_DURATION): Promise<void> {
        const cutoffDate = new Date(Date.now() - maxAge);
        
        await prisma.aIResponse.deleteMany({
            where: {
                createdAt: {
                    lt: cutoffDate,
                },
            },
        });
    }
}

export const openAIService = new OpenAIService();
export default OpenAIService;
