const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  uploadFile,
  getUserFiles,
  getFileById,
  updateFile,
  deleteFile,
} = require('../controllers/fileController');

/**
 * Routes for file management
 */

// @route POST /api/files/upload
// @desc Upload a new file
// @access Private
router.post('/upload', protect, uploadFile);

// @route GET /api/files
// @desc Get all files for current user
// @access Private
router.get('/', protect, getUserFiles);

// @route GET /api/files/:id
// @desc Get a specific file
// @access Private
router.get('/:id', protect, getFileById);

// @route PUT /api/files/:id
// @desc Update a file
// @access Private
router.put('/:id', protect, updateFile);

// @route DELETE /api/files/:id
// @desc Delete a file
// @access Private
router.delete('/:id', protect, deleteFile);

module.exports = router;
