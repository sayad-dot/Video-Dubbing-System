const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Video Dubbing System',
    version: '1.0.0'
  });
});

module.exports = router;
