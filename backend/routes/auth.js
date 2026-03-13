const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

/**
 * Rate limiting to prevent abuse
 * Login/Register: 5 attempts per 15 minutes per IP
 * General API: 100 requests per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login/register attempts, please try again later',
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skip: (req) => process.env.NODE_ENV === 'test',
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => process.env.NODE_ENV === 'test',
});

/**
 * Public Routes
 */

// Register
router.post('/register', loginLimiter, register);

// Login
router.post('/login', loginLimiter, login);

/**
 * Protected Routes (Requires Authentication)
 */

// Get profile
router.get('/profile', authMiddleware, getProfile);

// Update profile
router.put('/profile', authMiddleware, updateProfile);

// Change password
router.post('/change-password', authMiddleware, changePassword);

// Logout
router.post('/logout', authMiddleware, logout);

module.exports = router;
