// server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const passport = require('./config/passport'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

/* --------------------- ✅ CORS SETUP --------------------- */
// Define allowed origins for the frontend application
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://admindashbord.vercel.app' // Your Vite dev server
];

// Use the CORS middleware configured for dynamic origin allowance
app.use(
    cors({
        // Dynamic origin check handles both allowed dev environments and server-to-server requests
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, or server-to-server)
            if (!origin) return callback(null, true); 
            
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                console.error(`❌ CORS blocked: ${origin}`);
                // NOTE: Using a simple boolean false instead of throwing a custom Error 
                // often works better with CORS negotiation.
                return callback(false, false); 
            }
        },
        credentials: true, // IMPORTANT for session cookies and authentication headers
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.options('*', cors()); // Handle preflight requests for all routes

/* --------------------- 🧩 MIDDLEWARE --------------------- */
app.use(express.json()); // Body parser for application/json requests
app.use(express.urlencoded({ extended: true })); // Body parser for form data

// Session Middleware (Needed for Passport session functionality)
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'a_secure_default_key', // Use a strong, secret key
        resave: false, // Don't save session if not modified
        saveUninitialized: false, // Don't create session until something is stored
        cookie: {
             // Set a domain and secure flag in production
             maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    })
);

// Passport initialization MUST come after session middleware
app.use(passport.initialize());
app.use(passport.session());

/* --------------------- 💾 DATABASE CONNECTION --------------------- */
mongoose
    .connect(process.env.MONGO_URL, {
        // Mongoose 6+ typically handles these defaults, but explicit setup is safe
        // useNewUrlParser: true, 
        // useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));


/* --------------------- 📦 ROUTES --------------------- */
// Note: Ensure all these route files exist in your ./routes/ directory
app.use('/api/products', require('./routes/products'));
// Authentication routes receive the configured passport instance
app.use('/api/auth', require('./routes/auth')(passport)); 
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/user'));

/* --------------------- 🧪 TEST ROUTE --------------------- */
app.get('/', (req, res) => res.json({ message: 'Server running successfully!' }));

/* --------------------- ⚙️ ERROR HANDLER --------------------- */
// Centralized error handling middleware (must have all 4 arguments)
app.use((err, req, res, next) => {
    console.error('🔥 Global Error:', err.stack || err.message);
    // Send a generic 500 status response
    res.status(500).json({ 
        error: 'Internal Server Error', 
        details: err.message 
    });
});

/* --------------------- 🚀 START SERVER --------------------- */
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));