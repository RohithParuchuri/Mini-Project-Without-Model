require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const User = require('./models/User');

/**
 * Import routes
 */
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const fileRoutes = require('./routes/files');
const caseRoutes = require('./routes/cases');
const adminRoutes = require('./routes/admin');

/**
 * Initialize Express App
 */
const app = express();

/**
 * =====================================================
 * SECURITY MIDDLEWARE
 * =====================================================
 */

/**
 * Helmet.js - Set various HTTP headers for security
 * - Content Security Policy
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Strict-Transport-Security
 * - And more...
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

/**
 * CORS - Enable Cross-Origin Resource Sharing
 * Only accept requests from allowed origins
 */
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  })
);

/**
 * Global Rate Limiting
 * Prevents abuse and DoS attacks
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',
});

app.use(globalLimiter);

/**
 * Body Parser Middleware
 * Limit request size to prevent large payload attacks
 */
app.use(
  express.json({
    limit: '5mb', // Allow larger payloads for profile images etc.
  })
);

app.use(
  express.urlencoded({
    limit: '5mb',
    extended: true,
  })
);

/**
 * Security: Prevent parameter pollution
 * Note: Content-Type check removed to avoid blocking valid API calls
 */

/**
 * =====================================================
 * LOGGING MIDDLEWARE
 * =====================================================
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

/**
 * =====================================================
 * ROUTES
 * =====================================================
 */

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API version endpoint
app.get('/api/version', (req, res) => {
  res.status(200).json({
    success: true,
    version: '1.0.0',
    api: 'CyberGuard API',
  });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Profile Routes
app.use('/api/profile', profileRoutes);

// File Routes
app.use('/api/files', fileRoutes);

// Case Routes
app.use('/api/cases', caseRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

/**
 * =====================================================
 * ERROR HANDLING
 * =====================================================
 */

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

/**
 * Global Error Handler
 * Catches all errors and returns sanitized response
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error: ' + messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

  // Default error response (never expose stack trace in production)
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
  });
});

/**
 * =====================================================
 * DATABASE CONNECTION & SERVER START
 * =====================================================
 */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed admin user if not present
    try {
      const adminExists = await User.findOne({ email: 'admin@admin.com' });
      if (!adminExists) {
        await User.create({
          firstName: 'Admin',
          lastName: 'CyberGuard',
          email: 'admin@admin.com',
          password: 'admin@123',
          isAdmin: true,
          isVerified: true,
        });
        console.log('✅ Admin user created: admin@admin.com / admin@123');
      } else if (!adminExists.isAdmin) {
        adminExists.isAdmin = true;
        await adminExists.save();
        console.log('✅ Existing admin@admin.com promoted to admin');
      }
    } catch (seedErr) {
      console.error('Admin seed error:', seedErr.message);
    }

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════╗
║         CyberGuard API Server             ║
╠═══════════════════════════════════════════╣
║ Environment: ${process.env.NODE_ENV || 'development'.padEnd(25)} ║
║ Server: http://localhost:${PORT.toString().padEnd(27)} ║
║ MongoDB: Connected                        ║
╚═══════════════════════════════════════════╝
      `);
    });

    /**
     * Graceful shutdown
     */
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Unhandled promise rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
