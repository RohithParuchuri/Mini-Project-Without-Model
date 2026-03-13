const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, getProfileById } = require('../controllers/profileController');

/**
 * Routes for user profile management
 */

// @route GET /api/profile
// @desc Get current user's profile
// @access Private
router.get('/', protect, getProfile);

// @route PUT /api/profile
// @desc Update current user's profile
// @access Private
router.put('/', protect, updateProfile);

// @route GET /api/profile/:id
// @desc Get user profile by ID
// @access Public
router.get('/:id', getProfileById);

module.exports = router;
