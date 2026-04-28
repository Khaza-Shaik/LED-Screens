const express = require('express');
const router = express.Router();
const Screen = require('../models/Screen');
const Schedule = require('../models/Schedule');

// @route   GET api/device/:deviceId
// @desc    Get current and next video for device
router.get('/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  try {
    const screen = await Screen.findOne({ deviceId });
    if (!screen) return res.status(404).json({ msg: 'Device not found' });

    // Update lastSeen
    screen.lastSeen = new Date();
    screen.status = 'online';
    await screen.save();

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    // Find current playing video
    const currentSchedule = await Schedule.findOne({
      screenId: screen._id,
      date: currentDate,
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
      status: 'playing'
    }).populate('videoId');

    // Find next video
    const nextSchedule = await Schedule.findOne({
      screenId: screen._id,
      date: currentDate,
      startTime: { $gt: currentTime },
      status: 'approved'
    }).sort({ startTime: 1 }).populate('videoId');

    res.json({
      current: currentSchedule ? {
        ...currentSchedule.videoId.toJSON(),
        url: currentSchedule.videoId.url, // Explicitly include virtual url
        startTime: currentSchedule.startTime,
        endTime: currentSchedule.endTime
      } : null,
      next: nextSchedule ? {
        ...nextSchedule.videoId.toJSON(),
        startTime: nextSchedule.startTime
      } : null,
      screen: {
        name: screen.name,
        location: screen.location
      }
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
