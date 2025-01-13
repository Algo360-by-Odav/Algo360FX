import { prisma } from '../config/database';

async function checkSchema() {
  try {
    // Get table information
    const tableInfo = await prisma.$queryRaw`
      SELECT 
        table_name,
        column_name,
        data_type,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;
    
    console.log('Database Schema:', JSON.stringify(tableInfo, null, 2));

  } catch (error) {
    console.error('Failed to get schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
