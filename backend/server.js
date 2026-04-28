require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Models
const User = require('./models/User');
const Screen = require('./models/Screen');
const Video = require('./models/Video');
const Schedule = require('./models/Schedule');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection for Serverless/Vercel
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      if (process.env.VERCEL) {
        throw new Error('MONGODB_URI is missing in Vercel Environment Variables!');
      } else {
        console.log('🔄 No production database detected. Auto-provisioning temporary engine...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri);
        console.log('✨ Auto-Provisioned Engine Active');
      }
    } else {
      await mongoose.connect(uri);
      console.log('✅ Jaan Entertainment Backend: Online');
    }

    // Initialize default data if needed
    const adminExists = await User.findOne({ email: 'admin@jaan.com' });
    if (!adminExists) {
      await User.create({ name: 'System Admin', email: 'admin@jaan.com', password: 'adminjaan123', role: 'admin' });
    }
  } catch (err) {
    console.error('❌ Database Connection Error:', err.message);
    // Don't exit in serverless, just let the request fail so logs can be seen
    if (!process.env.VERCEL) process.exit(1);
  }
};

// Global connection state
let cachedDb = null;
app.use(async (req, res, next) => {
  if (!cachedDb) {
    await connectDB();
    cachedDb = mongoose.connection;
  }
  next();
});

// Socket.io context
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Root route
app.get('/', (req, res) => res.send('LED Screen API is running...'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/screens', require('./routes/screens'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/schedule', require('./routes/schedules'));
app.use('/api/device', require('./routes/device'));

// Start Scheduler
require('./services/scheduler');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
