const mongoose = require('mongoose');

/**
 * File Schema - Stores uploaded evidence files
 */
const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: [true, 'Please add a file name'],
      trim: true,
    },
    fileType: {
      type: String,
      required: [true, 'Please add a file type'],
    },
    fileSize: {
      type: Number,
      required: [true, 'Please add a file size'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'analyzed', 'completed'],
      default: 'pending',
    },
    analysisResult: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('File', fileSchema);
