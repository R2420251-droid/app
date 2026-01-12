const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

module.exports = function(transporter) {
  router.get('/', async (req, res, next) => {
    try {
      const [rows] = await db.query('SELECT * FROM enrollments');
      const enrollments = rows.map(e => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        course: e.course_title,
        submitted: e.submitted_date,
        status: e.status,
        avatarUrl: e.avatar_url,
        alt: e.alt_text
      }));
      res.json(enrollments);
  } catch (err) {
    logger.error('Error in enrollments route:', err);
    next(err);
  }
  });

  router.post('/', async (req, res, next) => {
    const { name, email, phone, course, submitted, avatarUrl, alt } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO enrollments (name, email, phone, course_title, submitted_date, status, avatar_url, alt_text) VALUES (?, ?, ?, ?, ?, "Pending", ?, ?)',
        [name, email, phone, course, submitted, avatarUrl, alt]
      );
      // Send email notification to admin
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Enrollment Received',
        text: `New enrollment: ${name} (${email}) enrolled in ${course}.`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) logger.error('Email send error:', error);
      });
      res.status(201).json({ id: result.insertId, ...req.body, status: 'Pending' });
  } catch (err) {
    logger.error('Error in enrollments route:', err);
    next(err);
  }
  });

  router.put('/:id', protect, admin, async (req, res, next) => {
    const { status } = req.body;
    try {
      await db.query('UPDATE enrollments SET status=? WHERE id=?', [status, req.params.id]);
      res.json({ message: 'Enrollment updated' });
  } catch (err) {
    logger.error('Error in enrollments route:', err);
    next(err);
  }
  });

  router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
      await db.query('DELETE FROM enrollments WHERE id=?', [req.params.id]);
      res.json({ message: 'Enrollment deleted' });
  } catch (err) {
    logger.error('Error in enrollments route:', err);
    next(err);
  }
  });

  return router;
};