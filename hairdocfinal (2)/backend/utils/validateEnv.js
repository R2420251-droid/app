/**
 * Validates that all required environment variables are set
 * Throws an error on startup if any are missing
 */
const validateEnv = () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
  ];

  const missingVars = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please ensure these are set in your .env file before starting the server.'
    );
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security.\n' +
      'Consider generating a stronger secret using: openssl rand -base64 32'
    );
  }

  // Validate email configuration (optional but warn if missing)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      '⚠️  WARNING: EMAIL_USER and/or EMAIL_PASS not set. Email functionality will be disabled.'
    );
  }
};

module.exports = validateEnv;
