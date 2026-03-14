const Case = require('../models/Case');
const File = require('../models/File');

/**
 * @desc Create a new case
 * @route POST /api/cases
 * @access Private
 */
exports.createCase = async (req, res) => {
  try {
    const { caseId, title, description, priority, evidenceFiles, tags } = req.body;

    if (!caseId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide caseId, title, and description',
      });
    }

    // Check if case ID already exists
    const existingCase = await Case.findOne({ caseId });
    if (existingCase) {
      return res.status(400).json({
        success: false,
        message: 'Case ID already exists',
      });
    }

    const newCase = await Case.create({
      userId: req.user.id,
      caseId,
      title,
      description,
      priority: priority || 'medium',
      evidenceFiles: evidenceFiles || [],
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: newCase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get all cases for current user
 * @route GET /api/cases
 * @access Private
 */
exports.getUserCases = async (req, res) => {
  try {
    // Admin sees ALL cases from ALL users; regular user sees only their own
    const query = req.user.isAdmin ? {} : { userId: req.user.id };
    const cases = await Case.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('evidenceFiles')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get a specific case
 * @route GET /api/cases/:id
 * @access Private
 */
exports.getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id).populate('evidenceFiles');

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check if user owns the case or is admin
    if (
      caseData.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this case',
      });
    }

    res.status(200).json({
      success: true,
      data: caseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update a case
 * @route PUT /api/cases/:id
 * @access Private
 */
exports.updateCase = async (req, res) => {
  try {
    const { title, description, status, investigationProgress, priority, notes, evidenceFiles, tags } = req.body;

    let caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check if user owns the case or is admin
    if (
      caseData.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this case',
      });
    }

    // Fields any case owner can update
    if (title) caseData.title = title;
    if (description) caseData.description = description;
    if (notes !== undefined) caseData.notes = notes;
    if (evidenceFiles) caseData.evidenceFiles = evidenceFiles;
    if (tags) caseData.tags = tags;

    // Admin-only fields: status, priority, investigationProgress
    if (req.user.isAdmin) {
      if (status) {
        caseData.status = status;
        if (status === 'closed') {
          caseData.completedAt = new Date();
        }
      }
      if (investigationProgress !== undefined) caseData.investigationProgress = investigationProgress;
      if (priority) caseData.priority = priority;
    }

    caseData.updatedAt = new Date();
    caseData = await caseData.save();

    await caseData.populate('evidenceFiles');

    res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      data: caseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete a case
 * @route DELETE /api/cases/:id
 * @access Private
 */
exports.deleteCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check if user owns the case or is admin
    if (
      caseData.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this case',
      });
    }

    await Case.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Case deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Add file to case
 * @route POST /api/cases/:id/files
 * @access Private
 */
exports.addFileToCase = async (req, res) => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fileId',
      });
    }

    let caseData = await Case.findById(req.params.id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check if user owns the case or is admin
    if (
      caseData.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this case',
      });
    }

    // Check if file exists and belongs to user
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    if (file.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add this file to case',
      });
    }

    // Check if file already in case
    if (caseData.evidenceFiles.includes(fileId)) {
      return res.status(400).json({
        success: false,
        message: 'File already added to this case',
      });
    }

    caseData.evidenceFiles.push(fileId);
    caseData = await caseData.save();
    await caseData.populate('evidenceFiles');

    res.status(200).json({
      success: true,
      message: 'File added to case successfully',
      data: caseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Remove file from case
 * @route DELETE /api/cases/:caseId/files/:fileId
 * @access Private
 */
exports.removeFileFromCase = async (req, res) => {
  try {
    const { caseId, fileId } = req.params;

    let caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check if user owns the case or is admin
    if (
      caseData.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this case',
      });
    }

    caseData.evidenceFiles = caseData.evidenceFiles.filter(
      (id) => id.toString() !== fileId
    );

    caseData = await caseData.save();
    await caseData.populate('evidenceFiles');

    res.status(200).json({
      success: true,
      message: 'File removed from case successfully',
      data: caseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
