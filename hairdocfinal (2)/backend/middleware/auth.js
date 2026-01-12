const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Validate JWT_SECRET is set on module load
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.');
}

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token - JWT_SECRET is guaranteed to be set at this point
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (decoded contains id and role directly)
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      logger.warn('Token verification failed:', { error: error.message, ip: req.ip });
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Super Admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };