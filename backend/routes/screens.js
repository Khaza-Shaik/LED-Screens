const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Screen = require('../models/Screen');

// @route   GET api/screens
// @desc    Get all screens
router.get('/', async (req, res) => {
  try {
    const screens = await Screen.find();
    res.json(screens);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   POST api/screens
// @desc    Add a screen (Admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
  const { name, location, deviceId, price } = req.body;
  try {
    const newScreen = new Screen({ name, location, deviceId, price });
    const screen = await newScreen.save();
    res.json(screen);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   PUT api/screens/:id
// @desc    Update screen
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
  try {
    const screen = await Screen.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(screen);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/screens/:id
// @desc    Delete screen
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
  try {
    await Screen.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Screen removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
