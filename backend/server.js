const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// MongoDB Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:21017/courseplatform')
    .then(() => console.log('✅ MongoDB connection established successfully.'))
    .catch((err) => console.error('❌ Database connection error:', err));

// Fallback Status Route
app.get('/', (req, res) => {
    res.send('Online Course Platform API Server running smoothly...');
});

// Start Server Listen
app.listen(PORT, () => {
    console.log(`🚀 Server actively listening on port ${PORT}`);
});
// Add this route import alongside your other imports at the top
const authRoutes = require('./routes/authRoutes');

// Mount the route middleware right below app.use(express.json());
app.use('/api/auth', authRoutes);
const courseRoutes = require('./routes/courseRoutes');

// Mount course management routing middleware
app.use('/api/courses', courseRoutes);