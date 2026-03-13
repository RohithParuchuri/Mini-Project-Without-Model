const File = require('../models/File');
const Case = require('../models/Case');

/**
 * @desc Upload a new file
 * @route POST /api/files/upload
 * @access Private
 */
exports.uploadFile = async (req, res) => {
  try {
    const { fileName, fileType, fileSize, description, tags } = req.body;

    if (!fileName || !fileType || fileSize === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fileName, fileType, and fileSize',
      });
    }

    const file = await File.create({
      userId: req.user.id,
      fileName,
      fileType,
      fileSize,
      description: description || '',
      tags: tags || [],
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get all files for current user
 * @route GET /api/files
 * @access Private
 */
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({
      uploadedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get a specific file
 * @route GET /api/files/:id
 * @access Private
 */
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check if user owns the file or is admin
    if (
      file.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this file',
      });
    }

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update file status
 * @route PUT /api/files/:id
 * @access Private
 */
exports.updateFile = async (req, res) => {
  try {
    const { status, analysisResult, tags, description } = req.body;

    let file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check if user owns the file or is admin
    if (
      file.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this file',
      });
    }

    // Update file
    if (status) file.status = status;
    if (analysisResult !== undefined) file.analysisResult = analysisResult;
    if (tags) file.tags = tags;
    if (description !== undefined) file.description = description;

    file = await file.save();

    res.status(200).json({
      success: true,
      message: 'File updated successfully',
      data: file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete a file
 * @route DELETE /api/files/:id
 * @access Private
 */
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check if user owns the file or is admin
    if (
      file.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this file',
      });
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
