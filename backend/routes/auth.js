// C:\Users\asus\Downloads\ifm\project\backend\routes\auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const { verifyAuth } = require('../middleware/auth'); 
// Assuming verifyAuth is the same as the 'protect' middleware

// 🛑 IMPORTANT: Define the frontend URL. This must match where your React app is running.
const FRONTEND_URL = process.env.NODE_ENV === 'production' 
    ? 'http://localhost:5173' 
    : 'http://localhost:5173'; // Use 5173 or 3000, depending on your setup

module.exports = (passport) => {

    // --- 1. LOCAL REGISTRATION ROUTE ---
    router.post('/register', async (req, res) => {
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // NOTE: Add a default 'role' if your model requires it, e.g., role: 'user'
            user = new User({ name, email, password: hashedPassword }); 
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({ 
                token, 
                user: { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email,
                    role: user.role || 'user' // Include role if it exists
                } 
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

    // --- 2. LOCAL LOGIN ROUTE ---
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // ✅ FIX: Ensure user role is returned for isAdmin check on the frontend
            res.json({ 
                token, 
                user: { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email,
                    role: user.role // Return the role
                } 
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

    // --- 3. PROTECTED PROFILE ROUTE (Fetch user details by token) ---
    router.get('/profile', verifyAuth, (req, res) => {
        // req.user is populated by verifyAuth middleware
        res.json({
            user: {
                id: req.user._id || req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role // Include role
            }
        });
    });

    // --- 4. GOOGLE OAUTH ROUTES ---
    // Start OAuth flow, redirects to Google
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // Google returns to this endpoint after successful authentication
    router.get(
        '/google/callback',
        // Redirect failure to the login page
        passport.authenticate('google', { 
            session: false, 
            failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` 
        }),
        (req, res) => {
            // Successful authentication, generate a JWT token for the user
            const userId = req.user._id || req.user.id;
            const userEmail = req.user.email;
            
            // Retrieve necessary user data from the object Passport provides
            const userName = req.user.name || 'User'; 
            const userRole = req.user.role || 'user'; // Default to 'user' if not set

            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // ✅ FIX: Redirect to the correct frontend callback path (/auth-callback) 
            // and include ALL required user data (id, name, role)
            const frontendRedirectUrl = `${FRONTEND_URL}/auth-callback?` +
                `token=${token}&` +
                `id=${userId}&` +
                `email=${encodeURIComponent(userEmail)}&` +
                `name=${encodeURIComponent(userName)}&` +
                `role=${userRole}`;
            
            res.redirect(frontendRedirectUrl); 
        }
    );

    // Must return the router instance
    return router;
};