const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  deviceId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Screen', ScreenSchema);
