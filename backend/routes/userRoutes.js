const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define user routes
router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
