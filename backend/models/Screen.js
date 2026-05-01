const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  deviceId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  price: { type: Number, default: 0 },
  lat: { type: Number, default: 16.5062 }, // Default to Vijayawada center
  lng: { type: Number, default: 80.6480 },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Screen', ScreenSchema);
