// create_admin.js - Run this on the server to create a Super Admin account
// Usage: node create_admin.js <password>
// Example: node create_admin.js 'MySecurePassword123!'

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: node create_admin.js <password>');
    console.error('Example: node create_admin.js "MySecurePassword123!"');
    process.exit(1);
  }

  try {
    // Load env vars (ensure .env is set up)
    require('dotenv').config();

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const hash = await bcrypt.hash(password, 10);

    const [res] = await conn.execute(
      'INSERT INTO users (name, email, username, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
      ['Super Admin', 'Mashizhasharon@gmail.com', 'mashizhasharon', hash, 'Super Admin', 'https://i.pravatar.cc/150?u=admin']
    );

    console.log('Super Admin created successfully!');
    console.log('Username: admin');
    console.log('Email: admin@hairdoc.co.za');
    console.log('Role: Super Admin');
    console.log('ID:', res.insertId);

    await conn.end();
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
})();