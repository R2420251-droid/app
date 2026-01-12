const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

module.exports = function(transporter) {
  router.get('/', async (req, res, next) => {
    try {
      const [rows] = await db.query('SELECT * FROM bookings ORDER BY booking_date DESC');
      const bookings = rows.map(b => ({
        id: b.id,
        clientName: b.client_name,
        clientEmail: b.client_email,
        clientPhone: b.client_phone,
        service: b.service_name,
        staff: b.staff_name,
        date: new Date(b.booking_date).toISOString().split('T')[0],
        time: b.booking_time,
        status: b.status,
        price: b.price,
        duration: b.duration
      }));
      res.json(bookings);
  } catch (err) {
    logger.error('Error in bookings route:', err);
    next(err);
  }
  });

  router.post('/', async (req, res, next) => {
    const { clientName, clientEmail, clientPhone, service, staff, date, time, price, duration } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO bookings (client_name, client_email, client_phone, service_name, staff_name, booking_date, booking_time, status, price, duration) VALUES (?, ?, ?, ?, ?, ?, ?, "Pending", ?, ?)',
        [clientName, clientEmail, clientPhone, service, staff, date, time, price, duration]
      );
      // Send email notification to admin
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to admin email
        subject: 'New Booking Received',
        text: `New booking: ${clientName} (${clientEmail}) booked ${service} on ${date} at ${time}.`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) logger.error('Email send error:', error);
      });
      res.status(201).json({ id: result.insertId, ...req.body, status: 'Pending' });
  } catch (err) {
    logger.error('Error in bookings route:', err);
    next(err);
  }
  });

  router.put('/:id', protect, admin, async (req, res, next) => {
    const { status, staff } = req.body; // Usually mainly updating status
    try {
      await db.query(
        'UPDATE bookings SET status=?, staff_name=? WHERE id=?',
        [status, staff, req.params.id]
      );
      res.json({ message: 'Booking updated' });
  } catch (err) {
    logger.error('Error in bookings route:', err);
    next(err);
  }
  });

  router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
      await db.query('DELETE FROM bookings WHERE id=?', [req.params.id]);
      res.json({ message: 'Booking deleted' });
  } catch (err) {
    logger.error('Error in bookings route:', err);
    next(err);
  }
  });

  return router;
};