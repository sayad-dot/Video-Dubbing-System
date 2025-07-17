const { default: srtParser } = require('srt-parser-2');
const { logger } = require('../utils/logger');

class SRTService {
  constructor() {
    this.parser = new srtParser();
  }

  /**
   * Parse SRT content and extract text with timestamps
   * @param {string} srtContent - Raw SRT file content
   * @returns {Array} Parsed SRT entries with timing info
   */
  parseSRT(srtContent) {
    try {
      const parsed = this.parser.fromSrt(srtContent);
      
      return parsed.map(entry => ({
        id: entry.id,
        startTime: entry.startTime,
        endTime: entry.endTime,
        startSeconds: entry.startSeconds,
        endSeconds: entry.endSeconds,
        text: Array.isArray(entry.text) ? entry.text.join(' ') : entry.text,
        duration: entry.endSeconds - entry.startSeconds
      }));
    } catch (error) {
      logger.error('Error parsing SRT content:', error);
      throw new Error('Invalid SRT format');
    }
  }

  /**
   * Validate SRT file format
   * @param {string} content - SRT content to validate
   * @returns {boolean} True if valid
   */
  validateSRT(content) {
    try {
      const lines = content.trim().split('\n');
      
      // Basic validation: should have at least 4 lines (id, timestamp, text, empty)
      if (lines.length < 4) return false;
      
      // Check if first line is a number (subtitle ID)
      if (isNaN(parseInt(lines[0]))) return false;
      
      // Check if second line has timestamp format
      const timeRegex = /\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/;
      if (!timeRegex.test(lines[1])) return false;
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract all text from SRT for TTS processing
   * @param {Array} parsedSRT - Parsed SRT entries
   * @returns {string} Combined text
   */
  extractTextForTTS(parsedSRT) {
    return parsedSRT.map(entry => entry.text).join(' ');
  }

  /**
   * Calculate total duration of SRT content
   * @param {Array} parsedSRT - Parsed SRT entries
   * @returns {number} Total duration in seconds
   */
  getTotalDuration(parsedSRT) {
    if (!parsedSRT.length) return 0;
    const lastEntry = parsedSRT[parsedSRT.length - 1];
    return lastEntry.endSeconds;
  }
}

module.exports = new SRTService();
