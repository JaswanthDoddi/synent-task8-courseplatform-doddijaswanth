const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Online Course Platform API Server running smoothly...');
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/courseplatform');
        console.log('✅ MongoDB connection established successfully.');

        app.listen(PORT, () => {
            console.log(`🚀 Server actively listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        process.exit(1);
    }
}

startServer();
