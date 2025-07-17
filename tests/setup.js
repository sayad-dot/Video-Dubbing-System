const { MongoMemoryServer } = require('mongodb-memory-server');
const IORedis = require('ioredis');

// Test environment setup
process.env.NODE_ENV = 'test';
process.env.PORT = 3001;
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.LOG_LEVEL = 'error';

// Global test setup
let redisServer;

beforeAll(async () => {
  // Start Redis for tests if needed
  const redis = new IORedis({
    host: 'localhost',
    port: 6379,
    lazyConnect: true,
    retryStrategy: () => null
  });

  try {
    await redis.ping();
    await redis.disconnect();
  } catch (error) {
    console.warn('Redis not available for tests, using mocks');
  }
});

afterAll(async () => {
  if (redisServer) {
    await redisServer.stop();
  }
});

// Global test helpers
global.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
