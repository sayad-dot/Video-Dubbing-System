const { Worker } = require('bullmq');
const { connection } = require('../config/queue');
const { logger } = require('../utils/logger');
const srtService = require('../services/srtService');

const extractWorker = new Worker(
  'workflow',
  async (job) => {
    if (job.name !== 'extract') return;

    logger.info('⛏  [Extract] started', { jobId: job.id });

    const { srtContent } = job.data;
    const parsed = srtService.parseSRT(srtContent);

    logger.info('⛏  [Extract] complete', { jobId: job.id, entries: parsed.length });
    return { parsed };
  },
  { 
    connection,
    concurrency: 2
  }
);

module.exports = extractWorker;
