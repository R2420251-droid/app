const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const compression = require('compression'); // add compression
require('dotenv').config();

// Validate environment variables on startup
const validateEnv = require('./utils/validateEnv');
try {
  validateEnv();
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  process.exit(1);
}

// Initialize logger
const logger = require('./utils/logger');

const { protect, admin } = require('./middleware/auth');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Compression for responses (gzip)
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts from this IP, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);

// CORS - make origins configurable via env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://hairdoc.co.za,https://www.hairdoc.co.za,http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Email transporter
let transporter;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
} catch (err) {
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

// Static folder for uploaded images (if using file system)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const db = require('./db');
  // Test database connection
  db.query('SELECT 1')
    .then(() => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected'
      });
    })
    .catch((err) => {
      logger.error('Health check failed:', err);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: err.message
      });
    });
});

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth')(transporter));
app.use('/api/services', require('./routes/services'));
app.use('/api/products', require('./routes/products'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/bookings', require('./routes/bookings')(transporter));
app.use('/api/enrollments', require('./routes/enrollments')(transporter));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/sync', require('./routes/sync'));
app.use('/api/upload', require('./routes/upload'));

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: 'Hair Doc API is running...',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      services: '/api/services'
    }
  });
});

// 404 handler for API routes (before static SPA fallback)
app.use('/api/*', notFound);

// --- Production Frontend Serving ---
// Prefer explicit env var FRONTEND_DIST; fall back to ../frontend/dist
const frontendDistPath = process.env.FRONTEND_DIST || path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Handles any non-API requests that don't match above routes by returning the SPA index
  app.get('*', (req, res) => {
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    return res.status(404).send('Frontend not built.');
  });
} else {
  // If there is no built frontend available, keep API behavior but make SPA message helpful
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).send('API endpoint not found.');
    } else {
      res.status(404).send('Frontend not built. Please run the frontend build process.');
    }
  });
}
// ------------------------------------

// Error handler middleware (must be last)
app.use(errorHandler);

// Export app for testing
module.exports = app;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3002;
  // Bind to 0.0.0.0 so hosts can reach the service.
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`✅ Server running on port ${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`📊 Health check available at: http://0.0.0.0:${PORT}/api/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async (err) => {
      if (err) {
        logger.error('Error closing HTTP server', err);
        process.exit(1);
      }
      try {
        const db = require('./db');
        if (db && typeof db.end === 'function') {
          await db.end();
          logger.info('Database pool closed.');
        }
      } catch (e) {
        logger.error('Error during DB pool close', e);
      }
      logger.info('Shutdown complete.');
      process.exit(0);
    });
    // Force exit if not closed within X ms
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
