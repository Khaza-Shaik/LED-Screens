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

// DB Connection
const startBackend = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    // Auto-provision database if no real URI is found
    if (!uri || uri.includes('localhost')) {
      console.log('🔄 No production database detected. Auto-provisioning temporary engine...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('✨ Auto-Provisioned Engine Active at:', uri);
    }

    await mongoose.connect(uri);
    console.log('✅ Jaan Entertainment Backend: Online');
    
    // Ensure test users exist
    const adminExists = await User.findOne({ email: 'admin@jaan.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@jaan.com',
        password: 'adminjaan123',
        role: 'admin'
      });
      console.log('👤 Root Admin: admin@jaan.com');
    }

    const userExists = await User.findOne({ email: 'user@jaan.com' });
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@jaan.com',
        password: 'userjaan123',
        role: 'user'
      });
      console.log('👤 Test User: user@jaan.com');
    }

    // Ensure default screens exist
    const screenCount = await Screen.countDocuments();
    if (screenCount === 0) {
      await Screen.create([
        { name: 'Benz Circle LED', location: 'Benz Circle, Vijayawada', deviceId: 'benz_circle_001', status: 'online' },
        { name: 'MG Road LED', location: 'MG Road, Vijayawada', deviceId: 'mg_road_001', status: 'online' }
      ]);
      console.log('🖥️  Production Screens Initialized');
    }
  } catch (err) {
    console.error('❌ Critical Startup Error:', err.message);
    process.exit(1);
  }
};

startBackend();

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
