const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename by appending a timestamp
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

// POST route for file upload
router.post('/', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Construct the URL to the uploaded file
    const imageUrl = `/uploads/${req.file.filename}`;
    logger.info('File uploaded successfully:', { filename: req.file.filename });
    res.status(200).json({ imageUrl });
  } catch (err) {
    logger.error('File upload error:', err);
    next(err);
  }
});

module.exports = router;
