const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

// Create Redis connection for BullMQ with proper settings
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,  // ✅ Required for BullMQ Workers
  retryDelayOnFailover: 100,
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy: (times) => {
    // Exponential backoff with max 20 seconds
    return Math.min(times * 50, 20000);
  }
});

// Handle connection events
connection.on('connect', () => {
  console.log('Redis connected for BullMQ');
});

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

connection.on('ready', () => {
  console.log('Redis connection ready');
});

// Create workflow queue
const workflowQueue = new Queue('workflow', { connection });

module.exports = {
  Queue,
  Worker,
  workflowQueue,
  connection
};
