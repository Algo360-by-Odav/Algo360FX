const mongoose = require('mongoose');
const { config } = require('./src/config/config');

const TEST_MONGODB_URI = config.databaseUrl.replace(
  /\/[^/]+$/,
  '/algo360fx_test'
);

beforeAll(async () => {
  try {
    await mongoose.connect(TEST_MONGODB_URI, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    });
    console.log('Connected to MongoDB Test Database:', TEST_MONGODB_URI);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}, 120000);

beforeEach(async () => {
  // Clean up all collections before each test
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
    console.log('Disconnected from MongoDB Test Database');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error);
  }
});
