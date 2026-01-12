const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For generating tokens
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

module.exports = function(transporter) {
  // Login
  router.post('/login', async (req, res, next) => {
    const { identifier, password } = req.body; // identifier = username or email
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [identifier, identifier]
      );

      if (users.length === 0) {
        logger.warn('Login attempt with invalid credentials:', { identifier });
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        logger.warn('Login attempt with invalid password:', { identifier: user.email });
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // JWT_SECRET is validated in auth middleware, but double-check here
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required');
      }
      
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Remove password from response
      delete user.password_hash;

      res.json({ token, user });
    } catch (err) {
      logger.error('Login error:', err);
      next(err);
    }
  });

  // Register (Client)
  router.post('/register', async (req, res, next) => {
    const { name, email, username, password } = req.body;
    try {
      // Check if user exists
      const [existing] = await db.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
      if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const role = 'Client';
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

      const [result] = await db.query(
        'INSERT INTO users (name, email, username, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, username, hash, role, avatar]
      );

      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
      logger.error('Registration error:', err);
      next(err);
    }
  });

  // Forgot Password
  router.post('/forgot-password', async (req, res, next) => {
    const { email } = req.body;
    try {
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(404).json({ message: 'User with that email does not exist' });
      }

      const user = users[0];
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

      await db.query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?', [
        resetToken,
        resetTokenExpiry,
        user.id,
      ]);

      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; // Frontend reset password route

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset',
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
               <p>Please click on the following link, or paste this into your browser to complete the process:</p>
               <p><a href="${resetUrl}">${resetUrl}</a></p>
               <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
      logger.error('Forgot password error:', err);
      next(err);
    }
  });

  // Reset Password
  router.put('/reset-password/:token', async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?',
        [token, Date.now()]
      );

      if (users.length === 0) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
      }

      const user = users[0];
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      await db.query(
        'UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
        [hash, user.id]
      );

      res.status(200).json({ message: 'Password has been reset' });
    } catch (err) {
      logger.error('Reset password error:', err);
      next(err);
    }
  });

  return router;
};