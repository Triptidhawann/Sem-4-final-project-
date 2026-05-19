const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, updatePassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:email', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.put('/profile/:id/password', updatePassword);

module.exports = router;
