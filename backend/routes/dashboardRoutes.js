const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Define dashboard route
router.get('/', dashboardController.getDashboardStats);

module.exports = router;
