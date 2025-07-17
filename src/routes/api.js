const express = require('express');
const srtController = require('../controllers/srtController');
const { upload, validateSRTUpload, validateJobId } = require('../middleware/validation');


const router = express.Router();


// SRT Processing Routes
router.post('/srt/upload', 
  upload.single('srt'), 
  validateSRTUpload, 
  srtController.uploadSRT
);

router.get('/srt/voices', srtController.getVoices);

router.get('/srt/download/:filename', srtController.downloadAudio);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SRT API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
