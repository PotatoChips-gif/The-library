const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', authController.register);

// @route   POST /api/users/login
// @desc    Login a user
router.post('/login', authController.login);

module.exports = router;