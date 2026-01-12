# 🚀 Quick Start Deployment Guide - HostAfrica

## 📦 Your Deployment Packages

You have **3 packages** ready for HostAfrica:

1. **`hairdoc_backend_20260111_101416.zip`** (82KB) - Backend only
2. **`hairdoc_frontend_20260111_101416.zip`** (108KB) - Frontend only  
3. **`hairdoc_full_20260111_101416.zip`** (192KB) ⭐ **RECOMMENDED** - Everything

## ⚡ Quick Deployment (5 Steps)

### Step 1: Database Setup (cPanel)
1. Login to **cPanel**
2. Go to **MySQL Databases**
3. Create database: `yourname_hairdoc`
4. Create user + password
5. Add user to database with **ALL PRIVILEGES**
6. Go to **phpMyAdmin** → Select database → **Import** → Upload `schema.sql`

### Step 2: Upload Packages
1. **Full Package**: Extract `hairdoc_full_*.zip`
2. Upload **frontend** files to `public_html/` (root of your website)
3. Upload **backend** files to `public_html/api/` (or subdirectory)

### Step 3: Configure Backend
1. In backend folder, create `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=paste_generated_secret_here
   PORT=3002
   NODE_ENV=production
   ```

2. **Generate JWT_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output to `.env` file

### Step 4: Install & Start Backend
**If using cPanel Node.js App:**
1. Go to **Setup Node.js App** in cPanel
2. Create new app pointing to backend folder
3. Set startup file: `server.js`
4. Add environment variables from `.env`
5. Click **Run NPM install**
6. Click **Restart App**

**If using SSH:**
```bash
cd backend
npm install --production
npm start
```

### Step 5: Test
1. ✅ Test backend: `https://yourdomain.com/api/health`
2. ✅ Test frontend: `https://yourdomain.com`
3. ✅ Test login

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] HostAfrica cPanel access ready
- [ ] Database created and user configured
- [ ] Domain name configured
- [ ] SSH access (if available)

### Database
- [ ] Database created
- [ ] User created with password
- [ ] User added to database with ALL PRIVILEGES
- [ ] `schema.sql` imported via phpMyAdmin

### Backend
- [ ] Backend files uploaded
- [ ] `.env` file created with correct credentials
- [ ] `JWT_SECRET` generated and set (32+ characters)
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running and accessible
- [ ] Health check works: `/api/health`

### Frontend
- [ ] Frontend files uploaded to `public_html/`
- [ ] `index.html` in root directory
- [ ] Assets folder accessible
- [ ] Frontend loads correctly

### Post-Deployment
- [ ] Can access frontend homepage
- [ ] Can login (admin and client)
- [ ] API endpoints work
- [ ] Database connection working
- [ ] File uploads work (if applicable)

## 🛠️ Troubleshooting

### Backend won't start
- Check Node.js version (need 16+)
- Verify `.env` file exists and has all variables
- Check database credentials are correct
- Review logs in `backend/logs/error.log`

### Frontend can't connect to backend
- Verify backend URL in code matches your setup
- Check CORS settings in `backend/server.js`
- Ensure backend is running
- Check browser console for errors

### Database connection error
- Verify credentials in `.env` file
- Check database user has correct permissions
- Ensure database exists
- Test connection manually if possible

### 500 Error / Server Error
- Check backend logs: `backend/logs/error.log`
- Verify all environment variables are set
- Check database connection
- Ensure JWT_SECRET is set correctly

## 📞 Quick Reference

### Important Files
- `backend/schema.sql` - Database schema
- `backend/.env` - Environment variables (create this)
- `backend/server.js` - Main server file
- `frontend/index.html` - Frontend entry point

### Important URLs (replace with your domain)
- Frontend: `https://yourdomain.com`
- Backend Health: `https://yourdomain.com/api/health`
- API Base: `https://yourdomain.com/api`

### Environment Variables Required
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_secret_here (generate with: openssl rand -base64 32)
PORT=3002
NODE_ENV=production
```

## ✅ Verification Steps

After deployment, verify everything works:

1. **Backend Health Check**
   ```bash
   curl https://yourdomain.com/api/health
   ```
   Should return: `{"status":"healthy","database":"connected",...}`

2. **Frontend Loads**
   - Visit `https://yourdomain.com`
   - Should see homepage

3. **Authentication Works**
   - Try admin login
   - Try client login/registration

4. **Database Connected**
   - Check health endpoint shows `"database":"connected"`

## 📚 Additional Documentation

- **Full Deployment Guide**: See `DEPLOYMENT_INSTRUCTIONS.md` in full package
- **Environment Setup**: `backend/ENV_SETUP.md`
- **API Documentation**: `backend/API.md`
- **Production Readiness**: `PRODUCTION_READINESS.md`

## 🎉 Success!

Once all checks pass, your Hair Doc application is live on HostAfrica!

---

**Need Help?**
- Check `ERRORS_AND_FIXES.md` for common issues
- Review backend logs: `backend/logs/error.log`
- Check browser console for frontend errors
- Verify all environment variables are set correctly
