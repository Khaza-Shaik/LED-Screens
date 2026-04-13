const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
const billboards = [
  { id: 1, location: "Times Square, NY", status: "Active", price: "$500/hr", impressions: "1.2M daily" },
  { id: 2, location: "Shibuya Crossing, Tokyo", status: "Active", price: "$450/hr", impressions: "800k daily" },
  { id: 3, location: "Piccadilly Circus, London", status: "Maintenance", price: "$400/hr", impressions: "600k daily" },
];

const ads = [];
const users = [];

// API Routes
app.get('/api/billboards', (req, res) => {
  res.json(billboards);
});

app.post('/api/ads/upload', (req, res) => {
  const { title, videoUrl, billboardId } = req.body;
  const newAd = { id: ads.length + 1, title, videoUrl, billboardId, status: "Pending" };
  ads.push(newAd);
  res.status(201).json(newAd);
});

app.get('/api/ads', (req, res) => {
  res.json(ads);
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const user = { id: users.length + 1, name, email, password };
  users.push(user);

  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = users.find((item) => item.email === email && item.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  return res.json({
    token: `mock-token-${user.id}`,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Serve Frontend (if built)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
