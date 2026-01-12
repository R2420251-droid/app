const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM gallery');
    const items = rows.map(i => ({
      id: i.id,
      category: i.category,
      caption: i.caption,
      imageUrl: i.image_url,
      alt: i.alt_text
    }));
    res.json(items);
  } catch (err) {
    logger.error('Error in gallery route:', err);
    next(err);
  }
});

router.post('/', protect, admin, async (req, res, next) => {
  const { category, caption, imageUrl, alt } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO gallery (category, caption, image_url, alt_text) VALUES (?, ?, ?, ?)',
      [category, caption, imageUrl, alt]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    logger.error('Error in gallery route:', err);
    next(err);
  }
});

router.put('/:id', protect, admin, async (req, res, next) => {
  const { category, caption, imageUrl, alt } = req.body;
  try {
    await db.query(
      'UPDATE gallery SET category=?, caption=?, image_url=?, alt_text=? WHERE id=?',
      [category, caption, imageUrl, alt, req.params.id]
    );
    res.json({ message: 'Gallery item updated' });
  } catch (err) {
    logger.error('Error in gallery route:', err);
    next(err);
  }
});

router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM gallery WHERE id=?', [req.params.id]);
    res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    logger.error('Error in gallery route:', err);
    next(err);
  }
});

module.exports = router;