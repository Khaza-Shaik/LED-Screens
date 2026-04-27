const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Schedule = require('../models/Schedule');

// @route   POST api/schedule
// @desc    Create a schedule
router.post('/', auth, async (req, res) => {
  const { videoId, screenId, date, startTime, endTime } = req.body;
  try {
    const newSchedule = new Schedule({
      videoId,
      screenId,
      userId: req.user.id,
      date,
      startTime,
      endTime,
      status: 'pending'
    });
    const schedule = await newSchedule.save();
    res.json(schedule);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   GET api/schedule
// @desc    Get schedules
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user.id }; // Simplified for now
    const schedules = await Schedule.find(query)
      .populate('videoId')
      .populate('screenId');
    res.json(schedules);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   PUT api/schedule/:id
// @desc    Update schedule status (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(schedule);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
