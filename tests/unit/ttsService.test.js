const ttsService = require('../../src/services/ttsService');
const fs = require('fs').promises;
const path = require('path');

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn()
  }
}));

describe('TTSService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAudio', () => {
    it('should generate audio file', async () => {
      const mockBuffer = Buffer.from('mock audio data');
      fs.writeFile.mockResolvedValue();
      
      const result = await ttsService.generateAudio('Hello World');
      
      expect(result).toMatch(/tts_\d+\.mp3$/);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle generation errors', async () => {
      fs.writeFile.mockRejectedValue(new Error('Write failed'));
      
      await expect(ttsService.generateAudio('Hello')).rejects.toThrow('Failed to generate audio');
    });
  });

  describe('getAvailableVoices', () => {
    it('should return available voices', () => {
      const voices = ttsService.getAvailableVoices();
      
      expect(voices).toHaveLength(3);
      expect(voices[0]).toMatchObject({
        id: 'default',
        name: 'Default Voice',
        language: 'en-US'
      });
    });
  });

  describe('estimateAudioDuration', () => {
    it('should estimate duration correctly', () => {
      const text = 'Hello World'.repeat(150); // 300 words
      const duration = ttsService.estimateAudioDuration(text);
      
      expect(duration).toBe(120); // 300 words / 150 wpm * 60 seconds
    });
  });
});
