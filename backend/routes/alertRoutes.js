const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Define alert routes
router.get('/', alertController.getAlerts);

module.exports = router;
