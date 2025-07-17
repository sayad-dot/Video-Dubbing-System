const Job = require('../models/Job');
const { logger } = require('../utils/logger');

class WorkflowService {
  constructor() {
    this.jobs = new Map(); // In-memory storage for demo
  }

  async createJob(type, data) {
    const job = new Job({ type, data });
    this.jobs.set(job.id, job);
    
    // Start processing immediately for demo
    this.processJob(job);
    
    return job;
  }

  async getJobStatus(jobId) {
    return this.jobs.get(jobId) || null;
  }

  async getJobResult(jobId) {
    return this.jobs.get(jobId) || null;
  }

  async processJob(job) {
    try {
      logger.info('Processing job', { jobId: job.id, type: job.type });
      
      // Simulate workflow steps
      job.updateStatus('processing', 10);
      await this.simulateStep('extract', job);
      
      job.updateStatus('processing', 50);
      await this.simulateStep('generate', job);
      
      job.updateStatus('processing', 90);
      await this.simulateStep('mix', job);
      
      job.setResult({
        message: 'Job completed successfully',
        processedAt: new Date(),
        steps: ['extract', 'generate', 'mix']
      });
      
      logger.info('Job completed', { jobId: job.id });
    } catch (error) {
      logger.error('Job processing failed', { jobId: job.id, error: error.message });
      job.setError(error.message);
    }
  }

  async simulateStep(stepName, job) {
    logger.info(`Executing step: ${stepName}`, { jobId: job.id });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    logger.info(`Step completed: ${stepName}`, { jobId: job.id });
  }
}

module.exports = new WorkflowService();
