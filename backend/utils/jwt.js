const jwt = require('jsonwebtoken');

/**
 * JWT Utilities for Token Generation and Verification
 * Implements secure token handling with expiration
 */

/**
 * Generate JWT access token
 * @param {string} userId - User ID to encode in token
 * @param {string} expiresIn - Token expiration time (default: 7 days)
 * @returns {string} - Signed JWT token
 */
const generateAccessToken = (userId, expiresIn = '7d') => {
  const token = jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: expiresIn,
      issuer: 'CyberGuard',
      audience: 'CyberGuard-Users',
    }
  );

  return token;
};

/**
 * Generate JWT refresh token (longer validity)
 * @param {string} userId - User ID to encode in token
 * @returns {string} - Signed refresh token
 */
const generateRefreshToken = (userId) => {
  const token = jwt.sign(
    { userId: userId.toString(), type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
      issuer: 'CyberGuard',
    }
  );

  return token;
};

/**
 * Verify JWT token
 * @param {string} token - Token to verify
 * @param {boolean} isRefreshToken - Is this a refresh token
 * @returns {object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token, isRefreshToken = false) => {
  try {
    const secret = isRefreshToken ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Decode token without verification (for inspection)
 * @param {string} token - Token to decode
 * @returns {object} - Decoded payload
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
};
