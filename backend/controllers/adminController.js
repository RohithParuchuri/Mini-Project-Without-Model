const User = require('../models/User');
const Case = require('../models/Case');
const File = require('../models/File');

/**
 * @desc Get all users (Admin only)
 * @route GET /api/admin/users
 * @access Private - Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get all cases (Admin only)
 * @route GET /api/admin/cases
 * @access Private - Admin
 */
exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.find()
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
 * @desc Get all files (Admin only)
 * @route GET /api/admin/files
 * @access Private - Admin
 */
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find()
      .populate('userId', 'firstName lastName email')
      .sort({ uploadedAt: -1 });

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
 * @desc Get all cases for a specific user (Admin only)
 * @route GET /api/admin/users/:userId/cases
 * @access Private - Admin
 */
exports.getUserCasesAdmin = async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.params.userId })
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
 * @desc Update case investigation progress (Admin only)
 * @route PUT /api/admin/cases/:caseId/progress
 * @access Private - Admin
 */
exports.updateCaseProgress = async (req, res) => {
  try {
    const { investigationProgress } = req.body;

    if (investigationProgress === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide investigationProgress',
      });
    }

    if (investigationProgress < 0 || investigationProgress > 100) {
      return res.status(400).json({
        success: false,
        message: 'investigationProgress must be between 0 and 100',
      });
    }

    const caseData = await Case.findByIdAndUpdate(
      req.params.caseId,
      { investigationProgress },
      { new: true, runValidators: true }
    ).populate('evidenceFiles');

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case progress updated successfully',
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
 * @desc Update case (Admin only) - status, title, description, priority, progress
 * @route PUT /api/admin/cases/:caseId
 * @access Private - Admin
 */
exports.updateCase = async (req, res) => {
  try {
    const { status, title, description, priority, investigationProgress } = req.body;

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (priority !== undefined) updateFields.priority = priority;
    if (investigationProgress !== undefined) {
      if (investigationProgress < 0 || investigationProgress > 100) {
        return res.status(400).json({
          success: false,
          message: 'investigationProgress must be between 0 and 100',
        });
      }
      updateFields.investigationProgress = investigationProgress;
    }

    // If status is closed, set completedAt
    if (status === 'closed') {
      updateFields.completedAt = new Date();
    }

    const caseData = await Case.findByIdAndUpdate(
      req.params.caseId,
      updateFields,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email').populate('evidenceFiles');

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

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
 * @desc Delete case (Admin only)
 * @route DELETE /api/admin/cases/:caseId
 * @access Private - Admin
 */
exports.deleteCase = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    await Case.findByIdAndDelete(req.params.caseId);

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
 * @desc Get all cases for a user and their progress (Admin only)
 * @route GET /api/admin/users/:userId/dashboard
 * @access Private - Admin
 */
exports.getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const cases = await Case.find({ userId: req.params.userId })
      .populate('evidenceFiles')
      .sort({ createdAt: -1 });

    const statistics = {
      totalCases: cases.length,
      openCases: cases.filter((c) => c.status === 'open').length,
      inProgressCases: cases.filter((c) => c.status === 'in-progress').length,
      closedCases: cases.filter((c) => c.status === 'closed').length,
      averageProgress:
        cases.length > 0
          ? Math.round(
              cases.reduce((sum, c) => sum + c.investigationProgress, 0) /
                cases.length
            )
          : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        user: user.getProfile(),
        cases,
        statistics,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
