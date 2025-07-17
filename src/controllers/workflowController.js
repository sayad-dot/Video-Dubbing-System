const workflowService = require('../services/workflowService');
const { logger } = require('../utils/logger');

class WorkflowController {
  async startJob(req, res, next) {
    try {
      const { type, data } = req.body;
      
      if (!type || !data) {
        return res.status(400).json({
          success: false,
          error: { message: 'Job type and data are required' }
        });
      }

      const job = await workflowService.createJob(type, data);
      
      logger.info('Workflow job started', { jobId: job.id, type });
      
      res.status(201).json({
        success: true,
        data: { job: job.toJSON() }
      });
    } catch (error) {
      logger.error('Error starting workflow job:', error);
      next(error);
    }
  }

  async getJobStatus(req, res, next) {
    try {
      const { jobId } = req.params;
      const job = await workflowService.getJobStatus(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          error: { message: 'Job not found' }
        });
      }

      res.json({
        success: true,
        data: { job: job.toJSON() }
      });
    } catch (error) {
      logger.error('Error getting job status:', error);
      next(error);
    }
  }

  async getJobResult(req, res, next) {
    try {
      const { jobId } = req.params;
      const job = await workflowService.getJobResult(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          error: { message: 'Job not found' }
        });
      }

      if (job.status !== 'completed') {
        return res.status(400).json({
          success: false,
          error: { message: 'Job not completed yet' }
        });
      }

      res.json({
        success: true,
        data: { 
          job: job.toJSON(),
          result: job.result
        }
      });
    } catch (error) {
      logger.error('Error getting job result:', error);
      next(error);
    }
  }
}

module.exports = new WorkflowController();
