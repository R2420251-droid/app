// Quick DB connectivity test script.
// Usage: from backend folder run `node test-db.js`
// It uses the same `db.js` pool and prints a concise success or error message.

const pool = require('./db');

(async () => {
  try {
    // simple query
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('DB connection: OK', rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('DB connection error:');
    // Print the full error stack for debugging but avoid logging secrets
    console.error(err && err.message ? err.message : String(err));
    process.exit(1);
  }
})();
