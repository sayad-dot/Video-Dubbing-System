const fs = require('fs').promises;
const path = require('path');
const srtService = require('../services/srtService');
const ttsService = require('../services/ttsService');
const { logger } = require('../utils/logger');

class SRTController {
  /**
   * Upload and process SRT file
   */
  async uploadSRT(req, res, next) {
    try {
      const { file } = req;
      
      // Read SRT file content
      const srtContent = await fs.readFile(file.path, 'utf8');
      
      // Validate SRT format
      if (!srtService.validateSRT(srtContent)) {
        await fs.unlink(file.path); // Clean up uploaded file
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid SRT file format' }
        });
      }

      // Parse SRT content
      const parsedSRT = srtService.parseSRT(srtContent);
      
      // Extract text for TTS
      const textForTTS = srtService.extractTextForTTS(parsedSRT);
      const totalDuration = srtService.getTotalDuration(parsedSRT);

      // For simple processing, generate TTS immediately
      const audioPath = await ttsService.generateAudio(textForTTS);

      // Clean up uploaded file
      await fs.unlink(file.path);

      logger.info('SRT processed successfully', {
        entriesCount: parsedSRT.length,
        totalDuration,
        audioPath
      });

      res.status(201).json({
        success: true,
        data: {
          srtEntries: parsedSRT,
          totalDuration,
          audioFile: audioPath.split('/').pop(), // Return filename only
          textLength: textForTTS.length,
          estimatedAudioDuration: ttsService.estimateAudioDuration(textForTTS)
        }
      });

    } catch (error) {
      logger.error('Error processing SRT upload:', error);
      
      // Clean up uploaded file if it exists
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (cleanupError) {
          logger.error('Error cleaning up uploaded file:', cleanupError);
        }
      }
      
      next(error);
    }
  }

  /**
   * Get TTS voices
   */
  async getVoices(req, res, next) {
    try {
      const voices = ttsService.getAvailableVoices();
      
      res.json({
        success: true,
        data: { voices }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download generated audio file
   */
  async downloadAudio(req, res, next) {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), 'uploads', 'processed', filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({
          success: false,
          error: { message: 'Audio file not found' }
        });
      }

      res.download(filePath, (error) => {
        if (error) {
          logger.error('Error downloading file:', error);
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SRTController();
