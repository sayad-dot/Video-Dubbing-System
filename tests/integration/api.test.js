const request = require('supertest');
const app = require('../../src/app');
const path = require('path');

describe('API Integration Tests', () => {
  describe('Health Endpoints', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toMatchObject({
        status: 'healthy',
        timestamp: expect.any(String)
      });
    });

    it('should return API health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toMatchObject({
        success: true,
        message: 'SRT API is running'
      });
    });
  });

  describe('SRT Processing', () => {
    it('should upload and process SRT file', async () => {
      const srtContent = `1
00:00:01,000 --> 00:00:03,000
Hello World
`;
      
      const response = await request(app)
        .post('/api/srt/upload')
        .attach('srt', Buffer.from(srtContent), 'test.srt')
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('srtEntries');
      expect(response.body.data.srtEntries).toHaveLength(1);
    });

    it('should reject invalid SRT file', async () => {
      const invalidContent = 'Not an SRT file';
      
      const response = await request(app)
        .post('/api/srt/upload')
        .attach('srt', Buffer.from(invalidContent), 'invalid.srt')
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid SRT file format');
    });

    it('should get available voices', async () => {
      const response = await request(app)
        .get('/api/srt/voices')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.voices).toHaveLength(3);
    });
  });

  describe('Workflow Endpoints', () => {
    it('should start workflow', async () => {
      const response = await request(app)
        .post('/api/workflow')
        .send({
          srt: '1\n00:00:01,000 --> 00:00:02,000\nTest\n'
        })
        .expect(202);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('jobId');
    });

    it('should reject workflow without SRT', async () => {
      const response = await request(app)
        .post('/api/workflow')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Missing SRT content');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/non-existent-endpoint')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Route not found');
    });
  });
});
