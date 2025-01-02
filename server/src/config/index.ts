import dotenv from 'dotenv';
import { Config } from '../types/config';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
}

export const config: Config = {
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algo360fx',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY as string,
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    }
};

export default config;
