const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM courses');
    const courses = rows.map(c => ({
      id: c.id,
      category: c.category,
      title: c.title,
      description: c.description,
      duration: c.duration,
      price: c.price,
      prerequisites: c.prerequisites,
      imageUrl: c.image_url,
      alt: c.alt_text
    }));
    res.json(courses);
  } catch (err) {
    logger.error('Error in courses route:', err);
    next(err);
  }
});

router.post('/', protect, admin, async (req, res, next) => {
  const { category, title, description, duration, price, prerequisites, imageUrl, alt } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO courses (category, title, description, duration, price, prerequisites, image_url, alt_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [category, title, description, duration, price, prerequisites, imageUrl, alt]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    logger.error('Error in courses route:', err);
    next(err);
  }
});

router.put('/:id', protect, admin, async (req, res, next) => {
  const { category, title, description, duration, price, prerequisites, imageUrl, alt } = req.body;
  try {
    await db.query(
      'UPDATE courses SET category=?, title=?, description=?, duration=?, price=?, prerequisites=?, image_url=?, alt_text=? WHERE id=?',
      [category, title, description, duration, price, prerequisites, imageUrl, alt, req.params.id]
    );
    res.json({ message: 'Course updated' });
  } catch (err) {
    logger.error('Error in courses route:', err);
    next(err);
  }
});

router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM courses WHERE id=?', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    logger.error('Error in courses route:', err);
    next(err);
  }
});

module.exports = router;