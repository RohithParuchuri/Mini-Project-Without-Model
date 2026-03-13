const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createCase,
  getUserCases,
  getCaseById,
  updateCase,
  deleteCase,
  addFileToCase,
  removeFileFromCase,
} = require('../controllers/caseController');

/**
 * Routes for case management
 */

// @route POST /api/cases
// @desc Create a new case
// @access Private
router.post('/', protect, createCase);

// @route GET /api/cases
// @desc Get all cases for current user
// @access Private
router.get('/', protect, getUserCases);

// @route GET /api/cases/:id
// @desc Get a specific case
// @access Private
router.get('/:id', protect, getCaseById);

// @route PUT /api/cases/:id
// @desc Update a case
// @access Private
router.put('/:id', protect, updateCase);

// @route DELETE /api/cases/:id
// @desc Delete a case
// @access Private
router.delete('/:id', protect, deleteCase);

// @route POST /api/cases/:id/files
// @desc Add file to case
// @access Private
router.post('/:id/files', protect, addFileToCase);

// @route DELETE /api/cases/:caseId/files/:fileId
// @desc Remove file from case
// @access Private
router.delete('/:caseId/files/:fileId', protect, removeFileFromCase);

module.exports = router;
