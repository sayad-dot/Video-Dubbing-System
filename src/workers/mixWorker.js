const { Worker } = require('bullmq');
const { connection } = require('../config/queue');
const { logger } = require('../utils/logger');
const path = require('path');
const fs = require('fs').promises;

const mixWorker = new Worker(
  'workflow',
  async (job) => {
    if (job.name !== 'mix') return;

    logger.info('🎛  [Mix] started', { jobId: job.id });

    const output = path.join(process.cwd(), 'uploads', 'processed', `mix_${Date.now()}.mp3`);
    await fs.writeFile(output, Buffer.from('FAKE_MIX_AUDIO'));

    logger.info('🎛  [Mix] complete', { jobId: job.id, output });
    return { ...job.data, mixedAudio: output };
  },
  { 
    connection,
    concurrency: 1
  }
);

module.exports = mixWorker;
