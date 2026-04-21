const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Mock Data (Shared with the original server)
const billboards = [
  { id: 1, location: "Benz Circle, Vijayawada", status: "High Demand", price: "₹4,500/hr", impressions: "1.8M", lat: 16.5015, lng: 80.6438, image: "/vijayawada-billboard.png" },
  { id: 2, location: "MG Road, Vijayawada", status: "Active", price: "₹3,800/hr", impressions: "1.2M", lat: 16.5135, lng: 80.6395, image: "/vijayawada-billboard.png" },
  { id: 3, location: "PNBS Area, Vijayawada", status: "Active", price: "₹3,200/hr", impressions: "2.5M", lat: 16.5186, lng: 80.6272, image: "/vijayawada-billboard.png" },
  { id: 4, location: "Cyber Hub, Gurgaon", status: "Active", price: "₹5,000/hr", impressions: "1.5M", lat: 28.4951, lng: 77.0878 },
  { id: 5, location: "Bandra-Worli Sea Link, Mumbai", status: "Active", price: "₹4,200/hr", impressions: "2.1M", lat: 19.0371, lng: 72.8174 },
  { id: 6, location: "Connaught Place, Delhi", status: "High Demand", price: "₹6,100/hr", impressions: "1.8M", lat: 28.6330, lng: 77.2194 },
  { id: 7, location: "Brigade Road, Bengaluru", status: "Active", price: "₹8,000/hr", impressions: "3M", lat: 12.9734, lng: 77.6061 },
];

const ads = [];
const users = [];

// API Routes
app.get('/api/billboards', (req, res) => {
  res.json(billboards);
});

app.post('/api/billboards', (req, res) => {
  const { location, price, impressions, lat, lng, image } = req.body;
  const newBillboard = {
    id: billboards.length > 0 ? Math.max(...billboards.map(b => b.id)) + 1 : 1,
    location,
    status: "Active",
    price,
    impressions,
    lat,
    lng,
    image: image || "/billboard-placeholder.png",
    lastUpdated: new Date().toISOString()
  };
  billboards.push(newBillboard);
  res.status(201).json(newBillboard);
});

app.put('/api/billboards/:id', (req, res) => {
  const { id } = req.params;
  const index = billboards.findIndex(b => b.id.toString() === id);
  if (index === -1) return res.status(404).json({ message: "Billboard not found" });
  
  billboards[index] = { ...billboards[index], ...req.body, lastUpdated: new Date().toISOString() };
  res.json(billboards[index]);
});

app.delete('/api/billboards/:id', (req, res) => {
  const { id } = req.params;
  const index = billboards.findIndex(b => b.id.toString() === id);
  if (index === -1) return res.status(404).json({ message: "Billboard not found" });
  
  billboards.splice(index, 1);
  res.status(204).send();
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
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) return res.status(409).json({ message: 'Email already registered.' });

  const user = { id: users.length + 1, name, email, password };
  users.push(user);
  return res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const user = users.find((item) => item.email === email && item.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

  return res.json({
    token: `mock-token-${user.id}`,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

module.exports = app;
