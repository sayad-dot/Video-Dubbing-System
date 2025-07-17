const { Worker } = require('bullmq');
const { connection } = require('../config/queue');
const { logger } = require('../utils/logger');
const ttsService = require('../services/ttsService');

const generateWorker = new Worker(
  'workflow',
  async (job) => {
    if (job.name !== 'generate') return;

    logger.info('🎙  [Generate] started', { jobId: job.id });

    const { parsed } = job.data;
    const text = parsed.map(e => e.text).join(' ');
    const audioPath = await ttsService.generateAudio(text);

    logger.info('🎙  [Generate] complete', { jobId: job.id, audioPath });
    return { ...job.data, audioPath };
  },
  { 
    connection,
    concurrency: 1
  }
);

module.exports = generateWorker;
