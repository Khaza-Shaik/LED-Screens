const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, default: 0 }, // in seconds
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

VideoSchema.virtual('url').get(function() {
  // Normalize path to use forward slashes for the URL
  return '/' + this.filePath.replace(/\\/g, '/');
});

module.exports = mongoose.model('Video', VideoSchema);
