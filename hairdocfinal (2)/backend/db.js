const mysql = require('mysql2');
require('dotenv').config();

// Create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hairdoc_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create a promise wrapper and attach an end() helper that closes the underlying pool.
// This keeps existing code that uses `db.query(...)` working with promises,
// but also provides a way to close connections for graceful shutdown.
const promisePool = pool.promise();
promisePool._close = () => pool.end(); // internal access if needed
// Expose a friendly end() method
promisePool.end = async function () {
  return new Promise((resolve, reject) => {
    pool.end(err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = promisePool;
