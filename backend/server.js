require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const hospitalRoutes = require('./routes/hospitalRoutes');
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const alertRoutes = require('./routes/alertRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Base Route
app.get('/', (req, res) => {
    res.send('API is running');
});

// API Routes
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
