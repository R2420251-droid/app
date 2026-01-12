const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    const products = rows.map(p => ({
      id: p.id,
      category: p.category,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.image_url,
      alt: p.alt_text
    }));
    res.json(products);
  } catch (err) {
    logger.error('Error in products route:', err);
    next(err);
  }
});

router.post('/', protect, admin, async (req, res, next) => {
  const { category, name, description, price, stock, imageUrl, alt } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (category, name, description, price, stock, image_url, alt_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category, name, description, price, stock, imageUrl, alt]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    logger.error('Error in products route:', err);
    next(err);
  }
});

router.put('/:id', protect, admin, async (req, res, next) => {
  const { category, name, description, price, stock, imageUrl, alt } = req.body;
  try {
    await db.query(
      'UPDATE products SET category=?, name=?, description=?, price=?, stock=?, image_url=?, alt_text=? WHERE id=?',
      [category, name, description, price, stock, imageUrl, alt, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    logger.error('Error in products route:', err);
    next(err);
  }
});

router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    logger.error('Error in products route:', err);
    next(err);
  }
});

module.exports = router;