const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MIGRATIONS_DIR = path.join(__dirname, 'files');
const MIGRATIONS_TABLE = 'schema_migrations';

/**
 * Create connection pool
 */
function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hairdoc_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

/**
 * Ensure migrations table exists
 */
async function ensureMigrationsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      version VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Get applied migrations
 */
async function getAppliedMigrations(pool) {
  const [rows] = await pool.query(`SELECT version FROM ${MIGRATIONS_TABLE} ORDER BY version`);
  return rows.map(row => row.version);
}

/**
 * Get migration files
 */
function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
    return [];
  }
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();
}

/**
 * Parse migration version from filename
 */
function getMigrationVersion(filename) {
  const match = filename.match(/^(\d+)_/);
  return match ? match[1] : null;
}

/**
 * Run a single migration
 */
async function runMigration(pool, filename) {
  const version = getMigrationVersion(filename);
  if (!version) {
    throw new Error(`Invalid migration filename: ${filename}`);
  }

  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf8');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Split SQL by semicolons and execute each statement
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    // Record migration
    await connection.query(
      `INSERT INTO ${MIGRATIONS_TABLE} (version, name) VALUES (?, ?)`,
      [version, filename]
    );

    await connection.commit();
    console.log(`✅ Applied migration: ${filename}`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Run all pending migrations
 */
async function migrate() {
  const pool = createPool();
  try {
    await ensureMigrationsTable(pool);
    const applied = await getAppliedMigrations(pool);
    const files = getMigrationFiles();

    const pending = files.filter(file => {
      const version = getMigrationVersion(file);
      return version && !applied.includes(version);
    });

    if (pending.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(`Found ${pending.length} pending migration(s)`);
    for (const file of pending) {
      await runMigration(pool, file);
    }

    console.log('✅ All migrations applied successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

/**
 * Rollback last migration (basic implementation)
 */
async function rollback() {
  const pool = createPool();
  try {
    await ensureMigrationsTable(pool);
    const [rows] = await pool.query(
      `SELECT version, name FROM ${MIGRATIONS_TABLE} ORDER BY version DESC LIMIT 1`
    );

    if (rows.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    const migration = rows[0];
    console.log(`Rolling back migration: ${migration.name}`);
    
    // Note: This is a basic implementation
    // In production, you'd want to store rollback SQL or implement a more sophisticated system
    await pool.query(`DELETE FROM ${MIGRATIONS_TABLE} WHERE version = ?`, [migration.version]);
    console.log(`✅ Rolled back migration: ${migration.name}`);
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// CLI
const command = process.argv[2];
if (command === 'migrate') {
  migrate();
} else if (command === 'rollback') {
  rollback();
} else {
  console.log('Usage: node migrations/index.js [migrate|rollback]');
  process.exit(1);
}

module.exports = { migrate, rollback };
