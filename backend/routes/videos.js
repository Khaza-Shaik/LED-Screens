const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

// Ensure uploads directory exists
const uploadDir = 'uploads/videos/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// @route   POST api/videos/upload
// @desc    Upload a video
router.post('/upload', [auth, upload.single('video')], async (req, res) => {
  try {
    const newVideo = new Video({
      title: req.body.title || 'Untitled',
      filePath: req.file.path,
      uploadedBy: req.user.id
    });
    const video = await newVideo.save();
    res.json(video);
  } catch (err) {
    res.status(500).send('Server error');
  }
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
