const path = require('path');
const fs = require('fs').promises;

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Generate unique filename
 */
function generateUniqueFilename(originalName, prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  
  return `${prefix}${name}_${timestamp}_${random}${ext}`;
}

/**
 * Clean up old files
 */
async function cleanupOldFiles(dirPath, maxAge = 24 * 60 * 60 * 1000) {
  try {
    const files = await fs.readdir(dirPath);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  ensureDir,
  generateUniqueFilename,
  cleanupOldFiles,
  formatFileSize
};
