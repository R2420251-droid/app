# Environment Setup Guide

This guide will help you set up the Hair Doc backend application.

## Prerequisites

- Node.js (v16 or higher recommended)
- MySQL database
- npm or yarn

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

### Required Variables

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=hairdoc_db

# JWT Secret (must be at least 32 characters for security)
# Generate with: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_here_at_least_32_characters

# Server Port
PORT=3002
```

### Optional Variables

```env
# Email Configuration (for password reset and notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Environment
NODE_ENV=development

# Logging
LOG_LEVEL=info
```

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Database

Create the database and run the schema:

```bash
mysql -u your_user -p
CREATE DATABASE hairdoc_db;
USE hairdoc_db;
SOURCE schema.sql;
```

### 3. Create `.env` File

Copy the example above and fill in your values:

```bash
cp .env.example .env  # If you have an example file
# Or create .env manually with the variables above
```

**Important:** Generate a strong JWT_SECRET:

```bash
openssl rand -base64 32
```

### 4. Run Migrations

If you have migration files:

```bash
npm run migrate
```

### 5. Create Admin User

```bash
node create_admin.js
```

### 6. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 7. Verify Installation

Check the health endpoint:

```bash
curl http://localhost:3002/api/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 0,
  "database": "connected"
}
```

## Troubleshooting

### Database Connection Issues

- Verify your database credentials in `.env`
- Ensure MySQL is running
- Check that the database exists
- Verify network/firewall settings

### JWT_SECRET Not Set

The application will fail to start if `JWT_SECRET` is not set. Make sure it's in your `.env` file.

### Email Not Working

If email functionality isn't working:
- Verify `EMAIL_USER` and `EMAIL_PASS` are set
- For Gmail, use an App Password (not your regular password)
- Check that email credentials are correct

### Port Already in Use

If port 3002 is already in use:
- Change `PORT` in `.env` to a different port
- Or stop the process using port 3002

## Production Deployment

For production deployment, ensure:

1. `NODE_ENV=production`
2. Strong `JWT_SECRET` (at least 32 characters)
3. Database credentials are secure
4. CORS origins are configured correctly
5. SSL/HTTPS is enabled
6. Logs directory exists and is writable
7. Uploads directory exists and is writable

See `DEPLOYMENT.md` for more details.
