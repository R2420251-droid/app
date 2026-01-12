const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
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

// Trust proxy (needed for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware - Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false // Allow embedding if needed
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many authentication attempts from this IP, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);

// Middleware
// Restrict CORS to the production domain and localhost for testing.
// This keeps the app secure in production while allowing local dev calls.
const allowedOrigins = [
  'https://hairdoc.co.za',
  'https://www.hairdoc.co.za',
  'http://localhost:5173',
  'http://localhost:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (like curl, server-to-server) with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Email transporter setup
// Use real SMTP transport when EMAIL_USER/PASS are provided, otherwise
// fall back to a harmless JSON transport so the app doesn't crash.
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
    // JSON transport is safe for environments without SMTP configured
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
} catch (err) {
  // If transporter creation fails, fallback to JSON transport
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

// Static folder for uploaded images (if using file system)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Health check endpoint (before rate limiting)
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

// --- Production Frontend Serving ---
// Serve the static files from the React app
const frontendDistPath = path.join(__dirname, '../dist');
app.use(express.static(frontendDistPath));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If index.html doesn't exist, it likely means the frontend hasn't been built.
    // Provide a helpful message for the developer.
    if (req.path.startsWith('/api/')) {
        // This case should ideally not be hit if API routes are defined before this middleware
        res.status(404).send('API endpoint not found.');
    } else {
        res.status(404).send('Frontend not built. Please run the frontend build process.');
    }
  }
});
// ------------------------------------

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: 'Hair Doc API is running...',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      services: '/api/services',
      products: '/api/products',
      courses: '/api/courses',
      bookings: '/api/bookings',
      enrollments: '/api/enrollments',
      gallery: '/api/gallery',
      orders: '/api/orders',
      settings: '/api/settings'
    }
  });
});

// 404 handler for API routes (before catch-all frontend route)
app.use('/api/*', notFound);

// Error handler middleware (must be last)
app.use(errorHandler);

// Export app for testing
module.exports = app;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3002;
  // Bind to 0.0.0.0 so Host Africa or other hosts can reach the service.
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`✅ Server running on port ${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`📊 Health check available at: http://0.0.0.0:${PORT}/api/health`);
  });
}