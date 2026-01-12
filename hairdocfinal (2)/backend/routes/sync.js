const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

// Helper to clear table and insert data
async function syncTable(tableName, data, mapper) {
    if (!data || data.length === 0) return;
    
    // 1. Prepare values
    const values = data.map(mapper);
    if (values.length === 0) return;

    // 2. Get keys from first item
    const keys = Object.keys(values[0]);
    const placeholders = keys.map(() => '?').join(',');
    
    // 3. Delete existing data (Full Overwrite Strategy for Sync)
    await db.query(`DELETE FROM ${tableName}`);

    // 4. Insert new data
    const sql = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders})`;
    
    for (const row of values) {
        await db.query(sql, Object.values(row));
    }
}

// PUSH: Frontend -> Database
router.post('/push', protect, admin, async (req, res, next) => {
    const data = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // 1. Services
        if (data['hair-doc-services']) {
            await syncTable('services', data['hair-doc-services'], s => ({
                id: s.id,
                category: s.category,
                name: s.name,
                description: s.description,
                duration: s.duration,
                price: s.price,
                image_url: s.imageUrl,
                alt_text: s.alt
            }));
        }

        // 2. Products
        if (data['hair-doc-products']) {
            await syncTable('products', data['hair-doc-products'], p => ({
                id: p.id,
                category: p.category,
                name: p.name,
                description: p.description,
                price: p.price,
                stock: p.stock,
                image_url: p.imageUrl,
                alt_text: p.alt
            }));
        }

        // 3. Courses
        if (data['hair-doc-courses']) {
            await syncTable('courses', data['hair-doc-courses'], c => ({
                id: c.id,
                category: c.category,
                title: c.title,
                description: c.description,
                duration: c.duration,
                price: c.price,
                prerequisites: c.prerequisites,
                image_url: c.imageUrl,
                alt_text: c.alt
            }));
        }

        // 4. Bookings
        if (data['hair-doc-bookings']) {
             await syncTable('bookings', data['hair-doc-bookings'], b => ({
                id: b.id,
                client_name: b.clientName,
                client_email: b.clientEmail,
                client_phone: b.clientPhone,
                service_name: b.service,
                staff_name: b.staff,
                booking_date: b.date,
                booking_time: b.time,
                status: b.status,
                price: b.price,
                duration: b.duration
            }));
        }

        // 5. Enrollments
        if (data['hair-doc-enrollments']) {
            await syncTable('enrollments', data['hair-doc-enrollments'], e => ({
                id: e.id,
                name: e.name,
                email: e.email,
                phone: e.phone,
                course_title: e.course,
                submitted_date: e.submitted,
                status: e.status,
                avatar_url: e.avatarUrl,
                alt_text: e.alt
            }));
        }

        // 6. Gallery
        if (data['hair-doc-galleryItems']) {
            await syncTable('gallery', data['hair-doc-galleryItems'], g => ({
                id: g.id,
                category: g.category,
                caption: g.caption,
                image_url: g.imageUrl,
                alt_text: g.alt
            }));
        }

        // 7. Orders
        if (data['hair-doc-orders']) {
            await syncTable('orders', data['hair-doc-orders'], o => ({
                id: o.id,
                client_name: o.clientName,
                order_date: o.date,
                status: o.status,
                total: o.total
            }));
        }

        // 8. Settings
        if (data['hair-doc-settings']) {
            const s = data['hair-doc-settings'];
            await connection.query(`UPDATE settings SET 
                salon_name=?, logo_url=?, favicon_url=?, maintenance_mode=?, 
                primary_phone=?, booking_email=?, address=?, 
                social_instagram=?, social_twitter=?, social_facebook=? 
                WHERE id=1`, 
                [s.salonName, s.logoUrl, s.faviconUrl, s.maintenanceMode, s.primaryPhone, s.bookingEmail, s.address, s.socials.instagram, s.socials.twitter, s.socials.facebook]
            );
        }

        // 9. Users
        // Note: For security, real apps shouldn't blindly overwrite users with plain text passwords. 
        // We will skip user sync in this demo to prevent locking out the admin, 
        // or you can implement it if you strictly manage users locally.

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        await connection.commit();
        res.json({ status: 'success', message: 'Database synced with local data.' });

    } catch (error) {
        await connection.rollback();
        logger.error('Sync push error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    } finally {
        connection.release();
    }
});

// PULL: Database -> Frontend
router.get('/pull', protect, admin, async (req, res, next) => {
    try {
        const [services] = await db.query('SELECT * FROM services');
        const [products] = await db.query('SELECT * FROM products');
        const [courses] = await db.query('SELECT * FROM courses');
        const [bookings] = await db.query('SELECT * FROM bookings');
        const [enrollments] = await db.query('SELECT * FROM enrollments');
        const [gallery] = await db.query('SELECT * FROM gallery');
        const [orders] = await db.query('SELECT * FROM orders');
        const [settingsRows] = await db.query('SELECT * FROM settings WHERE id=1');

        const data = {
            "hair-doc-services": services.map(s => ({
                id: s.id, category: s.category, name: s.name, description: s.description, duration: s.duration, price: s.price, imageUrl: s.image_url, alt: s.alt_text
            })),
            "hair-doc-products": products.map(p => ({
                id: p.id, category: p.category, name: p.name, description: p.description, price: p.price, stock: p.stock, imageUrl: p.image_url, alt: p.alt_text
            })),
            "hair-doc-courses": courses.map(c => ({
                id: c.id, category: c.category, title: c.title, description: c.description, duration: c.duration, price: c.price, prerequisites: c.prerequisites, imageUrl: c.image_url, alt: c.alt_text
            })),
            "hair-doc-bookings": bookings.map(b => ({
                id: b.id, clientName: b.client_name, clientEmail: b.client_email, clientPhone: b.client_phone, service: b.service_name, staff: b.staff_name, date: b.booking_date, time: b.booking_time, status: b.status, price: b.price, duration: b.duration
            })),
            "hair-doc-enrollments": enrollments.map(e => ({
                id: e.id, name: e.name, email: e.email, phone: e.phone, course: e.course_title, submitted: e.submitted_date, status: e.status, avatarUrl: e.avatar_url, alt: e.alt_text
            })),
            "hair-doc-galleryItems": gallery.map(g => ({
                id: g.id, category: g.category, caption: g.caption, imageUrl: g.image_url, alt: g.alt_text
            })),
            "hair-doc-orders": orders.map(o => ({
                id: o.id, clientName: o.client_name, date: o.order_date, status: o.status, total: o.total
            }))
        };

        if(settingsRows.length > 0) {
            const s = settingsRows[0];
            data["hair-doc-settings"] = {
                salonName: s.salon_name,
                logoUrl: s.logo_url,
                faviconUrl: s.favicon_url,
                maintenanceMode: Boolean(s.maintenance_mode),
                primaryPhone: s.primary_phone,
                bookingEmail: s.booking_email,
                address: s.address,
                socials: { instagram: s.social_instagram, twitter: s.social_twitter, facebook: s.social_facebook },
                apiUrl: "" // Do not overwrite local API URL config
            };
        }

        res.json({ status: 'success', data });

    } catch (error) {
        logger.error('Sync pull error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;