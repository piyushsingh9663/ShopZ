const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const {admin} = require('../middleware/adminMiddleware');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, getUsers, deleteAccount } = require('../controller/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.delete('/delete-account', protect, deleteAccount);
router.get('/users', protect, admin, getUsers);
module.exports = router;