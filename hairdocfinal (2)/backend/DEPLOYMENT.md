# HostAfrica Deployment Guide

## 1. Prepare Database
1. Log into **cPanel** on HostAfrica.
2. Go to **MySQL Databases**.
3. Create a new database (e.g., `yourname_hairdoc`).
4. Create a new user (e.g., `yourname_admin`) and password.
5. **Add User to Database** and check "ALL PRIVILEGES".

## 2. Create Table
1. Go to **phpMyAdmin** in cPanel.
2. Select your new database.
3. Click **Import** > Choose File > Select `hostafrica_backend/schema.sql` (or `backend/schema.sql` depending on where you kept it).
4. Click **Go**.

## 3. Configure & Upload Backend
1. Open `backend/db.js` (or `.env` if you prefer environment variables) in a code editor.
2. Update the DB connection details with your details from Step 1.
3. Go to **File Manager** in cPanel.
4. Upload your backend files to a folder (e.g., `public_html` or a subdirectory).
5. Ensure you install dependencies (`npm install`) if you have SSH access, or upload the `node_modules`.
   *Note: On shared hosting, it's often better to deploy as a Node.js app via "Setup Node.js App" in cPanel if available.*

## 4. Connect App
1. Open the Hair Doc Admin Panel (Frontend).
2. Go to **Settings**.
3. In "Database Integration", enter your backend API URL (e.g., `https://your-domain.com`).
4. Click **Push to Cloud** to save your initial data.