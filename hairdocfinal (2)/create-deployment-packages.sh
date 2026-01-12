#!/bin/bash

# Deployment Package Creator for HostAfrica
# This script creates deployment-ready zip files

set -e  # Exit on error

PROJECT_NAME="hairdoc"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_DIR="deployment"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

echo "🚀 Creating deployment packages for HostAfrica..."
echo ""

# Clean up previous deployment directories
rm -rf "$DEPLOY_DIR"
rm -f "${PROJECT_NAME}_backend_*.zip"
rm -f "${PROJECT_NAME}_frontend_*.zip"
rm -f "${PROJECT_NAME}_full_*.zip"

mkdir -p "$DEPLOY_DIR"

# Build frontend
echo "📦 Building frontend..."
cd "$FRONTEND_DIR"
if [ -d "node_modules" ]; then
    npm run build
else
    echo "⚠️  Frontend node_modules not found. Installing dependencies..."
    npm install
    npm run build
fi
cd ..

# Check if build was successful
if [ ! -d "$FRONTEND_DIR/dist" ]; then
    echo "❌ Frontend build failed! dist folder not found."
    exit 1
fi

echo "✅ Frontend built successfully"
echo ""

# Create backend package
echo "📦 Creating backend package..."
mkdir -p "$DEPLOY_DIR/${PROJECT_NAME}_backend"

# Copy backend files (excluding node_modules, logs, etc.)
rsync -av --progress \
    --exclude 'node_modules' \
    --exclude 'logs' \
    --exclude '*.log' \
    --exclude 'uploads/*' \
    --exclude '.env' \
    --exclude '.git' \
    --exclude '__tests__' \
    --exclude '.DS_Store' \
    "$BACKEND_DIR/" "$DEPLOY_DIR/${PROJECT_NAME}_backend/"

# Create uploads directory structure
mkdir -p "$DEPLOY_DIR/${PROJECT_NAME}_backend/uploads"
touch "$DEPLOY_DIR/${PROJECT_NAME}_backend/uploads/.gitkeep"

# Create logs directory structure
mkdir -p "$DEPLOY_DIR/${PROJECT_NAME}_backend/logs"
touch "$DEPLOY_DIR/${PROJECT_NAME}_backend/logs/.gitkeep"

# Create .env.example if it doesn't exist
if [ ! -f "$DEPLOY_DIR/${PROJECT_NAME}_backend/.env.example" ]; then
    cat > "$DEPLOY_DIR/${PROJECT_NAME}_backend/.env.example" << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=hairdoc_db

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_super_secret_jwt_key_here_at_least_32_characters

# Server Port
PORT=3002

# Email Configuration (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Environment
NODE_ENV=production

# Logging
LOG_LEVEL=info
EOF
fi

# Create backend package zip
cd "$DEPLOY_DIR"
zip -r "../${PROJECT_NAME}_backend_${TIMESTAMP}.zip" "${PROJECT_NAME}_backend" -q
cd ..
echo "✅ Backend package created: ${PROJECT_NAME}_backend_${TIMESTAMP}.zip"
echo ""

# Create frontend package (built version)
echo "📦 Creating frontend package (built)..."
mkdir -p "$DEPLOY_DIR/${PROJECT_NAME}_frontend"

# Copy built frontend
cp -r "$FRONTEND_DIR/dist/"* "$DEPLOY_DIR/${PROJECT_NAME}_frontend/"

# Create frontend package zip
cd "$DEPLOY_DIR"
zip -r "../${PROJECT_NAME}_frontend_${TIMESTAMP}.zip" "${PROJECT_NAME}_frontend" -q
cd ..
echo "✅ Frontend package created: ${PROJECT_NAME}_frontend_${TIMESTAMP}.zip"
echo ""

# Create full package (combined)
echo "📦 Creating full deployment package..."
mkdir -p "$DEPLOY_DIR/${PROJECT_NAME}_full/backend"
mkdir -p "$DEPLOY_DIR/${PROJECT_NAME}_full/frontend"

# Copy backend
rsync -av --progress \
    --exclude 'node_modules' \
    --exclude 'logs' \
    --exclude '*.log' \
    --exclude 'uploads/*' \
    --exclude '.env' \
    --exclude '.git' \
    --exclude '__tests__' \
    --exclude '.DS_Store' \
    "$BACKEND_DIR/" "$DEPLOY_DIR/${PROJECT_NAME}_full/backend/"

# Copy built frontend
cp -r "$FRONTEND_DIR/dist/"* "$DEPLOY_DIR/${PROJECT_NAME}_full/frontend/"

# Create directories
mkdir -p "$DEPLOY_DIR/${PROJECT_NAME}_full/backend/uploads"
mkdir -p "$DEPLOY_DIR/${PROJECT_NAME}_full/backend/logs"
touch "$DEPLOY_DIR/${PROJECT_NAME}_full/backend/uploads/.gitkeep"
touch "$DEPLOY_DIR/${PROJECT_NAME}_full/backend/logs/.gitkeep"

# Create deployment instructions
cat > "$DEPLOY_DIR/${PROJECT_NAME}_full/DEPLOYMENT_INSTRUCTIONS.md" << 'EOF'
# HostAfrica Deployment Instructions

## Quick Start Guide

### 1. Database Setup
1. Log into **cPanel** on HostAfrica
2. Go to **MySQL Databases**
3. Create a new database (e.g., `yourname_hairdoc`)
4. Create a new user and password
5. Add user to database with **ALL PRIVILEGES**
6. Go to **phpMyAdmin** and import `backend/schema.sql`

### 2. Backend Deployment

#### Option A: Using Node.js App in cPanel (Recommended)
1. In cPanel, go to **Setup Node.js App**
2. Create a new application
3. Set Node.js version to 18+ (or latest available)
4. Set Application root to your backend directory (e.g., `public_html/api`)
5. Set Application startup file to `server.js`
6. Set Application URL to your desired path (e.g., `/api` or subdomain)
7. Upload backend files to the application root
8. In the application settings, set environment variables:
   - `DB_HOST` - Usually `localhost`
   - `DB_USER` - Your database user
   - `DB_PASSWORD` - Your database password
   - `DB_NAME` - Your database name
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - `PORT` - Usually set automatically by HostAfrica
   - `NODE_ENV` - `production`
9. Click **Run NPM install** (or run `npm install` via SSH)
10. Click **Restart App**

#### Option B: Manual Deployment via SSH
1. Upload backend files to your server
2. SSH into your server
3. Navigate to backend directory
4. Copy `.env.example` to `.env` and configure it
5. Run `npm install --production`
6. Run `npm run migrate` (if migrations exist)
7. Use PM2 or similar to run: `npm start`

### 3. Frontend Deployment
1. Upload all files from the `frontend/` directory to your `public_html/` directory
2. Ensure `index.html` is in the root of `public_html/`
3. Configure your backend API URL if needed (should use relative paths)

### 4. Configuration
1. Ensure backend `.env` file has correct database credentials
2. Generate a strong `JWT_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
3. Update CORS settings in `backend/server.js` if needed

### 5. Verify Deployment
1. Check backend health: `https://yourdomain.com/api/health`
2. Visit frontend: `https://yourdomain.com`
3. Test login and basic functionality

## File Structure After Deployment

```
public_html/
├── index.html (frontend)
├── assets/ (frontend built files)
└── api/ (backend - if using subdirectory)
    ├── server.js
    ├── package.json
    ├── routes/
    └── ...
```

Or separate:

```
/home/user/
├── backend/
│   ├── server.js
│   └── ...
└── public_html/
    ├── index.html
    └── assets/
```

## Troubleshooting

### Backend won't start
- Check Node.js version (need 16+)
- Check environment variables are set correctly
- Check database connection details
- Check logs in `backend/logs/`

### Frontend can't connect to backend
- Verify backend URL in frontend code
- Check CORS settings in backend
- Verify backend is running and accessible

### Database connection errors
- Verify database credentials in `.env`
- Check database user has correct permissions
- Verify database exists

## Support Files

- `backend/API.md` - API documentation
- `backend/ENV_SETUP.md` - Environment setup guide
- `backend/DEPLOYMENT.md` - Detailed deployment guide
EOF

# Create full package zip
cd "$DEPLOY_DIR"
zip -r "../${PROJECT_NAME}_full_${TIMESTAMP}.zip" "${PROJECT_NAME}_full" -q
cd ..

echo "✅ Full package created: ${PROJECT_NAME}_full_${TIMESTAMP}.zip"
echo ""

# Create summary
echo "📋 Deployment Package Summary:"
echo "================================"
echo ""
echo "Backend Package:"
echo "  - ${PROJECT_NAME}_backend_${TIMESTAMP}.zip"
echo "  - Contains: Backend source files (no node_modules)"
echo "  - Size: $(du -h ${PROJECT_NAME}_backend_${TIMESTAMP}.zip | cut -f1)"
echo ""
echo "Frontend Package (Built):"
echo "  - ${PROJECT_NAME}_frontend_${TIMESTAMP}.zip"
echo "  - Contains: Built frontend (dist folder)"
echo "  - Size: $(du -h ${PROJECT_NAME}_frontend_${TIMESTAMP}.zip | cut -f1)"
echo ""
echo "Full Package:"
echo "  - ${PROJECT_NAME}_full_${TIMESTAMP}.zip"
echo "  - Contains: Both backend and frontend"
echo "  - Size: $(du -h ${PROJECT_NAME}_full_${TIMESTAMP}.zip | cut -f1)"
echo ""
echo "✅ All packages created successfully!"
echo ""
echo "Next steps:"
echo "1. Upload the appropriate package(s) to HostAfrica"
echo "2. Follow DEPLOYMENT_INSTRUCTIONS.md in the full package"
echo "3. Configure environment variables"
echo "4. Set up database and import schema.sql"
echo ""

# Clean up temp directory
rm -rf "$DEPLOY_DIR"

echo "✨ Done!"
