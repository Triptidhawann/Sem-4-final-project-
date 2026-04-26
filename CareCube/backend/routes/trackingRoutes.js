const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// Define tracking routes
router.get('/', trackingController.getTracking);
router.patch('/:id', trackingController.updateTrackingStatus);

module.exports = router;
