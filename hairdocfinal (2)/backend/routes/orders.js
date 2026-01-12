const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', protect, async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY order_date DESC');
    const orders = rows.map(o => ({
      id: o.id,
      clientName: o.client_name,
      date: o.order_date,
      status: o.status,
      total: o.total
    }));
    res.json(orders);
  } catch (err) {
    logger.error('Error in orders route:', err);
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { id, clientName, date, total } = req.body;
  try {
    await db.query(
      'INSERT INTO orders (id, client_name, order_date, status, total) VALUES (?, ?, ?, "Pending", ?)',
      [id, clientName, date, total]
    );
    res.status(201).json({ ...req.body, status: 'Pending' });
  } catch (err) {
    logger.error('Error in orders route:', err);
    next(err);
  }
});

router.put('/:id', protect, admin, async (req, res, next) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: 'Order updated' });
  } catch (err) {
    logger.error('Error in orders route:', err);
    next(err);
  }
});

module.exports = router;