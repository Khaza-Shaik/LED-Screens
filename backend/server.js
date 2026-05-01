require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Models
const User = require('./models/User');
const Billboard = require('./models/Billboard');
const Screen = require('./models/Screen');
const Video = require('./models/Video');
const Schedule = require('./models/Schedule');
const Plan = require('./models/Plan');

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
      console.log('👤 Created Admin: admin@jaan.com / adminjaan123');
    }

    const userExists = await User.findOne({ email: 'user@jaan.com' });
    if (!userExists) {
      await User.create({ name: 'Test User', email: 'user@jaan.com', password: 'userjaan123', role: 'user' });
      console.log('👤 Created User: user@jaan.com / userjaan123');
    }

    // Seed default plans if empty
    const planCount = await Plan.countDocuments();
    if (planCount === 0) {
      const defaultPlans = [
        {
          name: 'Starter',
          badge: null,
          price: '₹24,999',
          duration: '/week',
          desc: 'Perfect for brand-building campaigns in a single market.',
          features: ['1 city campaign', 'Up to 5 screens', 'Basic analytics dashboard', 'Email support', '72hr campaign activation'],
          cta: 'Get Started',
          highlight: false,
          order: 1
        },
        {
          name: 'Growth',
          badge: 'Most Popular',
          price: '₹79,999',
          duration: '/month',
          desc: 'The go-to plan for scaling brands across multiple cities.',
          features: ['10 city campaigns', 'Up to 40 screens', 'Live analytics & attribution', 'Priority support (4hr SLA)', 'Same-day activation', 'Custom branding'],
          cta: 'Start Free Trial',
          highlight: true,
          order: 2
        },
        {
          name: 'Enterprise',
          badge: null,
          price: 'Custom',
          duration: '',
          desc: 'Unlimited scale with a dedicated Jaan Entertainment media team.',
          features: ['Pan-India coverage', 'Unlimited screens', 'Advanced attribution & API', 'Dedicated account manager', 'Custom SLA', 'Quarterly business reviews'],
          cta: 'Talk to Sales',
          highlight: false,
          order: 3
        }
      ];
      await Plan.insertMany(defaultPlans);
      console.log('📄 Seeded default pricing plans');
    }

    // Seed Billboards removed by user request
  } catch (err) {
    console.error('❌ Database Connection Error:', err.message);
    if (!process.env.VERCEL) process.exit(1);
  }
};

// Global connection state
let cachedDb = null;
const initApp = async () => {
  await connectDB();
  cachedDb = mongoose.connection;
};
initApp();

app.use((req, res, next) => {
  if (!cachedDb) {
     return res.status(503).send('Database connecting...');
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
app.use('/api/billboards', require('./routes/billboards'));
app.use('/api/plans', require('./routes/plans'));

// Start Scheduler
require('./services/scheduler');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
