const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');

// Define allocation routes
router.get('/', allocationController.getAllocations);
router.post('/', allocationController.createAllocation);
router.patch('/:id', allocationController.updateAllocationStatus);

module.exports = router;
