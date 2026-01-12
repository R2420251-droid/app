const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM settings WHERE id=1');
    if (rows.length === 0) return res.json({});
    const s = rows[0];
    const settings = {
      salonName: s.salon_name,
      logoUrl: s.logo_url,
      faviconUrl: s.favicon_url,
      maintenanceMode: Boolean(s.maintenance_mode),
      primaryPhone: s.primary_phone,
      bookingEmail: s.booking_email,
      address: s.address,
      socials: {
        instagram: s.social_instagram,
        twitter: s.social_twitter,
        facebook: s.social_facebook
      }
    };
    res.json(settings);
  } catch (err) {
    logger.error('Error in settings route:', err);
    next(err);
  }
});

router.put('/', protect, admin, async (req, res, next) => {
  const { salonName, logoUrl, faviconUrl, maintenanceMode, primaryPhone, bookingEmail, address, socials } = req.body;
  try {
    await db.query(
      `UPDATE settings SET 
        salon_name=?, logo_url=?, favicon_url=?, maintenance_mode=?, 
        primary_phone=?, booking_email=?, address=?, 
        social_instagram=?, social_twitter=?, social_facebook=? 
      WHERE id=1`,
      [salonName, logoUrl, faviconUrl, maintenanceMode, primaryPhone, bookingEmail, address, socials.instagram, socials.twitter, socials.facebook]
    );
    res.json({ message: 'Settings updated' });
  } catch (err) {
    logger.error('Error in settings route:', err);
    next(err);
  }
});

module.exports = router;