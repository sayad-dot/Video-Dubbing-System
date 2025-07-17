const { workflowQueue } = require('../config/queue');
const { logger } = require('../utils/logger');
const crypto = require('crypto');

class WorkflowService {
  async startWorkflow(srtContent) {
    const jobId = crypto.randomUUID();

    // Add extract job
    const extractJob = await workflowQueue.add(
      'extract',
      { jobId, srtContent },
      { jobId: `extract_${jobId}`, removeOnComplete: 5, removeOnFail: 10 }
    );

    const generateJob = await workflowQueue.add(
      'generate',
      { jobId },
      { 
        jobId: `generate_${jobId}`,
        delay: 1000,
        removeOnComplete: 5, 
        removeOnFail: 10 
      }
    );

    const mixJob = await workflowQueue.add(
      'mix',
      { jobId },
      { 
        jobId: `mix_${jobId}`,
        delay: 3000,
        removeOnComplete: 5, 
        removeOnFail: 10 
      }
    );

    logger.info('Workflow started', { jobId });
    return jobId;
  }

  async getStatus(jobId) {
    try {
      const extractJob = await workflowQueue.getJob(`extract_${jobId}`);
      const generateJob = await workflowQueue.getJob(`generate_${jobId}`);
      const mixJob = await workflowQueue.getJob(`mix_${jobId}`);

      const jobs = [extractJob, generateJob, mixJob].filter(Boolean);
      
      if (jobs.length === 0) {
        return null;
      }

      const statuses = await Promise.all(
        jobs.map(async (job) => ({
          name: job.name,
          state: await job.getState(),
          progress: job.progress || 0
        }))
      );

      return {
        id: jobId,
        steps: statuses,
        overall: this.calculateOverallStatus(statuses)
      };
    } catch (error) {
      logger.error('Error getting workflow status:', error);
      return null;
    }
  }

  // ADD THIS MISSING FUNCTION
  calculateOverallStatus(statuses) {
    const completed = statuses.filter(s => s.state === 'completed').length;
    const failed = statuses.filter(s => s.state === 'failed').length;
    
    if (failed > 0) return 'failed';
    if (completed === statuses.length) return 'completed';
    return 'processing';
  }

  async getResult(jobId) {
    try {
      const mixJob = await workflowQueue.getJob(`mix_${jobId}`);
      if (!mixJob) return null;

      const state = await mixJob.getState();
      if (state !== 'completed') return null;

      return mixJob.returnvalue;
    } catch (error) {
      logger.error('Error getting workflow result:', error);
      return null;
    }
  }
}

module.exports = new WorkflowService();
