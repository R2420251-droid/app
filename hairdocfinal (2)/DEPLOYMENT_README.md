# Deployment Packages for HostAfrica

## 📦 Created Packages

Three deployment packages have been created:

### 1. `hairdoc_backend_[timestamp].zip`
- **Size**: ~84KB
- **Contents**: Backend source files only
- **Excludes**: node_modules, logs, .env files
- **Use when**: You want to deploy backend separately

### 2. `hairdoc_frontend_[timestamp].zip`
- **Size**: ~108KB
- **Contents**: Built frontend (production-ready dist folder)
- **Use when**: You want to deploy frontend separately or already have backend running

### 3. `hairdoc_full_[timestamp].zip` ⭐ RECOMMENDED
- **Size**: ~192KB
- **Contents**: Both backend and frontend
- **Includes**: DEPLOYMENT_INSTRUCTIONS.md
- **Use when**: Deploying everything fresh (recommended for first deployment)

## 🚀 Quick Deployment Steps

### Option 1: Full Package (Recommended)

1. **Extract** `hairdoc_full_[timestamp].zip`
2. **Upload backend files** to your server (via FTP/SSH or cPanel File Manager)
3. **Upload frontend files** to `public_html/` directory
4. **Set up database** (see instructions below)
5. **Configure environment variables** (create `.env` file)
6. **Install dependencies**: `npm install` in backend directory
7. **Start the application**

### Option 2: Separate Packages

1. Extract and deploy backend package first
2. Configure backend and verify it's running
3. Extract and deploy frontend package to `public_html/`

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Have HostAfrica cPanel access
- [ ] Have database credentials ready
- [ ] Know your domain name
- [ ] Have SSH access (recommended) or FTP access

### Database Setup
1. [ ] Create MySQL database in cPanel
2. [ ] Create database user
3. [ ] Grant user privileges
4. [ ] Import `backend/schema.sql` via phpMyAdmin

### Backend Deployment
1. [ ] Upload backend files to server
2. [ ] Create `.env` file with database credentials
3. [ ] Set `JWT_SECRET` (generate with: `openssl rand -base64 32`)
4. [ ] Install dependencies: `npm install --production`
5. [ ] Run migrations: `npm run migrate`
6. [ ] Start backend service
7. [ ] Test health endpoint: `https://yourdomain.com/api/health`

### Frontend Deployment
1. [ ] Upload frontend files to `public_html/`
2. [ ] Ensure `index.html` is in root
3. [ ] Verify assets folder is accessible
4. [ ] Test frontend loads correctly

### Post-Deployment
1. [ ] Test login functionality
2. [ ] Test API endpoints
3. [ ] Verify CORS settings if needed
4. [ ] Check error logs
5. [ ] Test file uploads

## 🔧 Environment Variables

Create a `.env` file in your backend directory with:

```env
# Database
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_super_secret_key_here

# Server
PORT=3002
NODE_ENV=production

# Email (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Logging
LOG_LEVEL=info
```

## 📖 Detailed Instructions

For detailed step-by-step instructions, see:
- **Full Package**: `DEPLOYMENT_INSTRUCTIONS.md` (inside full package)
- **Backend**: `backend/DEPLOYMENT.md`
- **Environment Setup**: `backend/ENV_SETUP.md`
- **API Documentation**: `backend/API.md`

## 🆘 Troubleshooting

### Backend won't start
- Check Node.js version (need 16+)
- Verify all environment variables are set
- Check database connection credentials
- Review logs in `backend/logs/`

### Frontend can't connect to backend
- Verify backend URL is correct
- Check CORS settings in `backend/server.js`
- Ensure backend is running and accessible
- Check browser console for errors

### Database connection errors
- Verify credentials in `.env` file
- Check database user has proper permissions
- Ensure database exists
- Test connection manually if possible

## 📞 Support

- Review `PRODUCTION_READINESS.md` for production checklist
- Check `ERRORS_AND_FIXES.md` for common issues
- Review API documentation in `backend/API.md`

## ✨ Package Information

- **Generated**: [Timestamp will show in filename]
- **Includes**: Production-ready code with all security fixes
- **Security**: All critical security issues resolved
- **Status**: Production-ready ✅
