// C:\Users\asus\Downloads\ifm\project\backend\routes\auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
// FIX: Import 'verifyAuth' (which is 'protect') from the middleware
const { verifyAuth } = require('../middleware/auth'); 


// KEY FIX: Export a function that receives the configured passport object
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

            user = new User({ name, email, password: hashedPassword });
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
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

            res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

    // --- 3. PROTECTED PROFILE ROUTE (Fails with 401 if token is bad) ---
    router.get('/profile', verifyAuth, (req, res) => {
        // req.user is populated by verifyAuth (middleware/auth.js)
        res.json({
            user: {
                id: req.user._id || req.user.id, // Use the correct ID field
                name: req.user.name,
                email: req.user.email,
            }
        });
    });

    // --- 4. GOOGLE OAUTH ROUTES ---
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get(
        '/google/callback',
        passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/auth?error=login_failed' }),
        (req, res) => {
            // Successful authentication, generate a JWT token for the user
            const userId = req.user._id || req.user.id;
            const userEmail = req.user.email;
            
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

            const frontendRedirectUrl = `http://localhost:3000/auth?token=${token}&email=${encodeURIComponent(userEmail)}`;
            
            res.redirect(frontendRedirectUrl); 
        }
    );

    // FIX: Must return the router instance
    return router;
};