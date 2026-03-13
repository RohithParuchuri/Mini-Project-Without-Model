const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token from request headers
 * Extracts and validates user information
 */

/**
 * protect - Verify JWT and attach full user (including isAdmin) to req.user
 * Used by all protected routes
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No authorization header provided' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ success: false, message: 'Invalid authorization header format. Use: Bearer <token>' });
    }
    const token = parts[1];
    const decoded = verifyToken(token);
    // Fetch user from DB to get latest isAdmin and account status
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.userId = user._id.toString();
    req.user = { id: user._id.toString(), isAdmin: user.isAdmin };
    next();
  } catch (error) {
    let message = 'Authentication failed';
    if (error.message === 'Token has expired') message = 'Token has expired';
    else if (error.message === 'Invalid token') message = 'Invalid token';
    return res.status(401).json({ success: false, message });
  }
};

/**
 * Verify JWT token from Authorization header
 * Expected format: "Bearer <token>"
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided',
      });
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format. Use: Bearer <token>',
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    let statusCode = 401;
    let message = 'Authentication failed';

    if (error.message === 'Token has expired') {
      statusCode = 401;
      message = 'Token has expired';
    } else if (error.message === 'Invalid token') {
      statusCode = 401;
      message = 'Invalid token';
    }

    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't fail if no token is provided, but validates it if present
 */
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    // Not required, so continue without user
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  protect,
};
