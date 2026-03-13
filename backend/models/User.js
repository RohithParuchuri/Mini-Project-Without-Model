const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');

/**
 * User Schema with Security Features
 * - Password hashing with bcryptjs (10 salt rounds)
 * - Email validation
 * - Timestamps for audit trail
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters'],
      minlength: [2, 'First name must be at least 2 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters'],
      minlength: [2, 'Last name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
      default: '',
    },
    profileImage: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: {
      type: Date,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware: Hash password before saving
 * Only hash if password is new or modified
 * Uses bcryptjs with 10 salt rounds for security
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const SALT_ROUNDS = 10;
    const salt = await bcryptjs.genSalt(SALT_ROUNDS);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method: Compare provided password with stored hash
 * @param {string} candidatePassword - Password to compare
 * @returns {boolean} - True if password matches
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcryptjs.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed: ' + error.message);
  }
};

/**
 * Method: Get user profile (exclude sensitive data)
 * @returns {object} - User profile object
 */
userSchema.methods.getProfile = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    bio: this.bio,
    profileImage: this.profileImage,
    isVerified: this.isVerified,
    isAdmin: this.isAdmin,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

/**
 * Method: Lock account on multiple failed login attempts
 */
userSchema.methods.lockAccount = function (durationMinutes = 30) {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
};

/**
 * Method: Check if account is locked
 * @returns {boolean} - True if account is locked
 */
userSchema.methods.isAccountLocked = function () {
  return this.accountLockedUntil && this.accountLockedUntil > new Date();
};

/**
 * Method: Reset failed login attempts
 */
userSchema.methods.resetFailedAttempts = function () {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = null;
};

module.exports = mongoose.model('User', userSchema);
