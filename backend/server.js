const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const applicationRoutes = require('./routes/applications');
const talentRoutes = require('./routes/talents');
const uploadRoutes = require('./routes/upload');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow large base64 images

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
