const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Get All
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM services');
    // Map snake_case db columns to camelCase frontend expected
    const services = rows.map(s => ({
      id: s.id,
      category: s.category,
      name: s.name,
      description: s.description,
      duration: s.duration,
      price: s.price,
      imageUrl: s.image_url,
      alt: s.alt_text
    }));
    res.json(services);
  } catch (err) {
    logger.error('Error fetching services:', err);
    next(err);
  }
});

// Create
router.post('/', protect, admin, async (req, res, next) => {
  const { category, name, description, duration, price, imageUrl, alt } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO services (category, name, description, duration, price, image_url, alt_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category, name, description, duration, price, imageUrl, alt]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    logger.error('Error in services route:', err);
    next(err);
  }
});

// Update
router.put('/:id', protect, admin, async (req, res, next) => {
  const { category, name, description, duration, price, imageUrl, alt } = req.body;
  try {
    await db.query(
      'UPDATE services SET category=?, name=?, description=?, duration=?, price=?, image_url=?, alt_text=? WHERE id=?',
      [category, name, description, duration, price, imageUrl, alt, req.params.id]
    );
    res.json({ message: 'Service updated' });
  } catch (err) {
    logger.error('Error in services route:', err);
    next(err);
  }
});

// Delete
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM services WHERE id=?', [req.params.id]);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    logger.error('Error in services route:', err);
    next(err);
  }
});

module.exports = router;