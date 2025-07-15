const morgan = require('morgan');

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = {
  info: (message, data = {}) => {
    if (logLevel === 'debug' || logLevel === 'info') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, error);
  },
  debug: (message, data = {}) => {
    if (logLevel === 'debug') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  warn: (message, data = {}) => {
    if (logLevel === 'debug' || logLevel === 'info' || logLevel === 'warn') {
      console.warn(`[WARN] ${message}`, data);
    }
  }
};

// Morgan middleware for HTTP request logging
const httpLogger = morgan('combined', {
  skip: (req, res) => {
    // Skip logging for health check endpoints
    return req.url === '/health';
  }
});

module.exports = { logger, httpLogger };
