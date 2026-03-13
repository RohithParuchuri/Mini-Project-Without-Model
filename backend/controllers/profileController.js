const User = require('../models/User');

/**
 * @desc Get user profile
 * @route GET /api/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.getProfile(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update user profile
 * @route PUT /api/profile
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, profileImage } = req.body;

    // Validation
    if (firstName && firstName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'First name must be at least 2 characters',
      });
    }

    if (lastName && lastName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Last name must be at least 2 characters',
      });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Bio cannot exceed 500 characters',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(bio !== undefined && { bio }),
        ...(profileImage !== undefined && { profileImage }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user.getProfile(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get user profile by ID (public)
 * @route GET /api/profile/:id
 * @access Public
 */
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.getProfile(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
