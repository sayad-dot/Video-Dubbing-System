const srtService = require('../../src/services/srtService');

describe('SRTService', () => {
  describe('parseSRT', () => {
    it('should parse valid SRT content', () => {
      const srtContent = `1
00:00:01,000 --> 00:00:03,000
Hello World

2
00:00:04,000 --> 00:00:06,000
This is a test`;

      const result = srtService.parseSRT(srtContent);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: '1',
        text: 'Hello World',
        startSeconds: 1,
        endSeconds: 3,
        duration: 2
      });
    });

    it('should handle invalid SRT content', () => {
      const invalidSRT = 'Invalid SRT content';
      
      expect(() => {
        srtService.parseSRT(invalidSRT);
      }).toThrow('Invalid SRT format');
    });
  });

  describe('validateSRT', () => {
    it('should validate correct SRT format', () => {
      const validSRT = `1
00:00:01,000 --> 00:00:03,000
Hello World

2
00:00:04,000 --> 00:00:06,000
This is a test`;
      
      expect(srtService.validateSRT(validSRT)).toBe(true);
    });

    it('should reject invalid SRT format', () => {
      const invalidSRT = 'Not an SRT file';
      
      expect(srtService.validateSRT(invalidSRT)).toBe(false);
    });
  });

  describe('extractTextForTTS', () => {
    it('should extract text from parsed SRT', () => {
      const parsedSRT = [
        { text: 'Hello' },
        { text: 'World' }
      ];
      
      const result = srtService.extractTextForTTS(parsedSRT);
      expect(result).toBe('Hello World');
    });
  });

  describe('getTotalDuration', () => {
    it('should calculate total duration', () => {
      const parsedSRT = [
        { endSeconds: 3 },
        { endSeconds: 6 },
        { endSeconds: 10 }
      ];
      
      const result = srtService.getTotalDuration(parsedSRT);
      expect(result).toBe(10);
    });

    it('should return 0 for empty SRT', () => {
      const result = srtService.getTotalDuration([]);
      expect(result).toBe(0);
    });
  });
});
