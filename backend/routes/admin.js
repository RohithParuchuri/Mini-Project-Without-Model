const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllUsers,
  getAllCases,
  getAllFiles,
  getUserCasesAdmin,
  updateCaseProgress,
  updateCase,
  deleteCase,
  getUserDashboard,
} = require('../controllers/adminController');

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access admin routes',
    });
  }
  next();
};

/**
 * Routes for admin management (Protected by auth and admin check)
 */

// @route GET /api/admin/users
// @desc Get all users
// @access Private - Admin
router.get('/users', protect, isAdmin, getAllUsers);

// @route GET /api/admin/cases
// @desc Get all cases
// @access Private - Admin
router.get('/cases', protect, isAdmin, getAllCases);

// @route GET /api/admin/files
// @desc Get all files
// @access Private - Admin
router.get('/files', protect, isAdmin, getAllFiles);

// @route GET /api/admin/users/:userId/cases
// @desc Get all cases for a specific user
// @access Private - Admin
router.get('/users/:userId/cases', protect, isAdmin, getUserCasesAdmin);

// @route GET /api/admin/users/:userId/dashboard
// @desc Get user dashboard
// @access Private - Admin
router.get('/users/:userId/dashboard', protect, isAdmin, getUserDashboard);

// @route PUT /api/admin/cases/:caseId/progress
// @desc Update case investigation progress
// @access Private - Admin
router.put('/cases/:caseId/progress', protect, isAdmin, updateCaseProgress);

// @route PUT /api/admin/cases/:caseId
// @desc Update case (status, title, description, priority, progress)
// @access Private - Admin
router.put('/cases/:caseId', protect, isAdmin, updateCase);

// @route DELETE /api/admin/cases/:caseId
// @desc Delete a case
// @access Private - Admin
router.delete('/cases/:caseId', protect, isAdmin, deleteCase);

module.exports = router;
