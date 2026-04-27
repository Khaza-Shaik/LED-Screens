const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  screenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  startTime: { type: String, required: true }, // Format: HH:mm
  endTime: { type: String, required: true }, // Format: HH:mm
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'playing', 'completed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
