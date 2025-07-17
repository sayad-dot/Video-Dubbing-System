const { logger } = require('../utils/logger');

class SRTService {
  constructor() {
    this.timeRegex = /(\d{2}):(\d{2}):(\d{2}),(\d{3})/;
  }

  parseSRT(srtContent) {
    try {
      if (!srtContent || srtContent.trim().length === 0) {
        throw new Error('Invalid SRT format');
      }

      const entries = [];
      const blocks = srtContent.trim().split(/\n\s*\n/);
      
      for (const block of blocks) {
        const lines = block.trim().split('\n');
        if (lines.length < 3) continue;
        
        const id = lines[0];
        const timeLine = lines[1];
        const text = lines.slice(2).join(' ').trim();
        
        // Parse timing line
        const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
        if (!timeMatch) continue;
        
        const startTime = timeMatch[1];
        const endTime = timeMatch[2];
        const startSeconds = this.timeToSeconds(startTime);
        const endSeconds = this.timeToSeconds(endTime);
        
        entries.push({
          id: id,
          startTime: startTime,
          endTime: endTime,
          startSeconds: startSeconds,
          endSeconds: endSeconds,
          text: text,
          duration: endSeconds - startSeconds
        });
      }
      
      if (entries.length === 0) {
        throw new Error('Invalid SRT format');
      }
      
      return entries;
    } catch (error) {
      logger.error('Error parsing SRT content:', error);
      throw new Error('Invalid SRT format');
    }
  }

  validateSRT(content) {
    try {
      if (!content || content.trim().length === 0) return false;
      
      const lines = content.trim().split('\n');
      
      // Basic validation: should have at least 4 lines
      if (lines.length < 4) return false;
      
      // Check if first line is a number (subtitle ID)
      if (isNaN(parseInt(lines[0]))) return false;
      
      // Check if second line has timestamp format
      const timeRegex = /\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/;
      if (!timeRegex.test(lines[1])) return false;
      
      // Try to parse the content
      const parsed = this.parseSRT(content);
      return parsed.length > 0;
    } catch (error) {
      return false;
    }
  }

  timeToSeconds(timeStr) {
    const match = timeStr.match(this.timeRegex);
    if (!match) return 0;
    
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const milliseconds = parseInt(match[4], 10);
    
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }

  extractTextForTTS(parsedSRT) {
    return parsedSRT.map(entry => entry.text).join(' ');
  }

  getTotalDuration(parsedSRT) {
    if (!parsedSRT.length) return 0;
    const lastEntry = parsedSRT[parsedSRT.length - 1];
    return lastEntry.endSeconds;
  }
}

module.exports = new SRTService();
