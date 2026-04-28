const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

// Ensure uploads directory exists
const uploadDir = 'uploads/creative/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images and videos are allowed!'));
  }
});

// @route   POST api/videos/upload
// @desc    Upload a creative (video or image)
router.post('/upload', [auth, upload.single('video')], async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const newVideo = new Video({
      title: req.body.title || 'Untitled',
      filePath: req.file.path.replace(/\\/g, '/'), // Sanitize for cross-platform
      uploadedBy: req.user.id
    });
    const video = await newVideo.save();
    res.json(video);
  } catch (err) {
    console.error('Upload Error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/videos/upload
// @desc    Helper for browser access
router.get('/upload', (req, res) => {
  res.status(405).json({ 
    msg: 'Method Not Allowed', 
    instruction: 'This endpoint only accepts POST requests for file uploads. Please use the application interface to upload files.' 
  });
});

// @route   GET api/videos
// @desc    Get user's videos
router.get('/', auth, async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.user.id });
    res.json(videos);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
