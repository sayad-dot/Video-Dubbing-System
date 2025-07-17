const workflowService = require('../../src/services/workflowService');

// Mock the queue
jest.mock('../../src/config/queue', () => ({
  workflowQueue: {
    add: jest.fn(),
    getJob: jest.fn(),
    getJobs: jest.fn()
  }
}));

const { workflowQueue } = require('../../src/config/queue');

describe('WorkflowService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startWorkflow', () => {
    it('should start a workflow with extract job', async () => {
      workflowQueue.add.mockResolvedValue({ id: 'job-1' });
      
      const jobId = await workflowService.startWorkflow('test srt content');
      
      expect(jobId).toBeDefined();
      expect(workflowQueue.add).toHaveBeenCalledWith(
        'extract',
        expect.objectContaining({
          jobId,
          srtContent: 'test srt content'
        }),
        expect.any(Object)
      );
    });
  });

  describe('getStatus', () => {
    it('should return job status', async () => {
      const mockJob = {
        getState: jest.fn().mockResolvedValue('completed'),
        progress: 100
      };
      
      workflowQueue.getJob.mockResolvedValue(mockJob);
      
      const status = await workflowService.getStatus('test-job-id');
      
      expect(status).toBeDefined();
      expect(status.id).toBe('test-job-id');
    });

    it('should return null for non-existent job', async () => {
      workflowQueue.getJob.mockResolvedValue(null);
      
      const status = await workflowService.getStatus('non-existent');
      
      expect(status).toBeNull();
    });
  });

  describe('calculateOverallStatus', () => {
    it('should calculate overall status correctly', () => {
      const statuses = [
        { state: 'completed' },
        { state: 'completed' },
        { state: 'processing' }
      ];
      
      const overall = workflowService.calculateOverallStatus(statuses);
      expect(overall).toBe('processing');
    });

    it('should return failed if any step failed', () => {
      const statuses = [
        { state: 'completed' },
        { state: 'failed' }
      ];
      
      const overall = workflowService.calculateOverallStatus(statuses);
      expect(overall).toBe('failed');
    });
  });
});
