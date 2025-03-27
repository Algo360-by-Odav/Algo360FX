import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnections() {
    console.log('🔍 Testing database connections...');

    // Test PostgreSQL Connection
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        },
        log: ['warn', 'error']
    });
    
    try {
        console.log('Attempting PostgreSQL connection...');
        await prisma.$connect();
        console.log('✅ PostgreSQL Connection successful!');
        
        // Simple test query
        const dbInfo = await prisma.$queryRaw`SELECT current_database();`;
        console.log('Connected to database:', dbInfo);
    } catch (error) {
        console.error('❌ PostgreSQL Connection failed');
        console.error('Error details:', error);
    } finally {
        await prisma.$disconnect();
    }

    console.log('\n-------------------\n');

    // Test Redis Connection
    const redis = new Redis();

    try {
        const pong = await redis.ping();
        console.log('✅ Redis Connection successful!', pong);
    } catch (error) {
        console.error('❌ Redis Connection failed:', error);
    } finally {
        redis.quit();
    }
}

testConnections()
    .catch(console.error)
    .finally(() => process.exit(0));