// C:\Users\asus\Downloads\ifm\project\backend\server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const passport = require('./config/passport'); // Correct path

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Setup
app.use(cors({
    // 🛑 CHANGE THIS: MUST allow the exact origin of the frontend.
    origin: 'http://localhost:3000', 
    // MUST be true for passing cookies/session/auth headers across domains.
    credentials: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'a_secure_default_key',
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes (Line 44 is likely here. Ensure all required files export 'router'.)
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth')(passport)); // Fix for Passport dependency
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/user')); // Assuming your latest router is 'users'

// Test route
app.get('/', (req, res) => res.json({ message: 'Server running successfully!' }));

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));