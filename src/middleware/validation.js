const multer = require('multer');
const path = require('path');
const { logger } = require('../utils/logger');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads', 'temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for SRT files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/plain' || file.originalname.endsWith('.srt')) {
    cb(null, true);
  } else {
    cb(new Error('Only SRT files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

/**
 * Validation middleware for SRT upload
 */
const validateSRTUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { message: 'No SRT file uploaded' }
    });
  }

  logger.info('SRT file uploaded', {
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });

  next();
};

/**
 * Validation middleware for job ID parameters
 */
const validateJobId = (req, res, next) => {
  const { jobId } = req.params;
  
  if (!jobId || typeof jobId !== 'string') {
    return res.status(400).json({
      success: false,
      error: { message: 'Valid job ID is required' }
    });
  }

  next();
};

module.exports = {
  upload,
  validateSRTUpload,
  validateJobId
};
