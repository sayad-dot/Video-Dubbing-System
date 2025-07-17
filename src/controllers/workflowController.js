const workflowService = require('../services/workflowService');
const { logger } = require('../utils/logger');

class WorkflowController {
  /* POST /api/workflow */
  async start(req, res, next) {
    try {
      if (!req.body?.srt) {
        return res.status(400).json({ success: false, error: { message: 'Missing SRT content' } });
      }
      const jobId = await workflowService.startWorkflow(req.body.srt);
      res.status(202).json({ success: true, data: { jobId } });
    } catch (e) {
      logger.error('Workflow start failed', e);
      next(e);
    }
  }

  /* GET /api/workflow/:jobId/status */
  async status(req, res, next) {
    try {
      const info = await workflowService.getStatus(req.params.jobId);
      if (!info) return res.status(404).json({ success: false, error: { message: 'Job not found' } });
      res.json({ success: true, data: info });
    } catch (e) { next(e); }
  }

  /* GET /api/workflow/:jobId/result */
  async result(req, res, next) {
    try {
      const data = await workflowService.getResult(req.params.jobId);
      if (!data) return res.status(404).json({ success: false, error: { message: 'Result not ready' } });
      res.json({ success: true, data });
    } catch (e) { next(e); }
  }
}

module.exports = new WorkflowController();
