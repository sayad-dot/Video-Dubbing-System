const { workflowQueue } = require('../config/queue');
const { logger } = require('../utils/logger');
const { v4: uuid } = require('uuid');        // add once:  npm i uuid

class WorkflowService {
  /* Kick-off 3-step pipeline */
  async startWorkflow(srtContent) {
    const jobId = uuid();

    /* 1️⃣  EXTRACT -------------------------------------------------- */
    await workflowQueue.add(
      'extract',
      { jobId, srtContent },
      {
        jobId, removeOnComplete: true, removeOnFail: true,
        onComplete: { name: 'generate', data: { jobId } }   // chain next step
      }
    );

    logger.info('Workflow started', { jobId });
    return jobId;
  }

  /* 2️⃣  GENERATE step enqueued automatically by BullMQ */

  /* 3️⃣  MIX step is triggered via onComplete option in worker */

  /* Status polling */
  async getStatus(jobId) {
    const job = await workflowQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    const progress = job._progress;
    return { id: jobId, state, progress };
  }

  /* Result polling (stored in mix step) */
  async getResult(jobId) {
    const jobs = await workflowQueue.getJobs(['completed']);
    const target = jobs.find(j => j.id === jobId);
    return target ? target.returnvalue : null;
  }
}

module.exports = new WorkflowService();
