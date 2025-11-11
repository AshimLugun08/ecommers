// C:\Users\asus\Downloads\ifm\project\backend\routes\users.js
// Assuming this is the file where the user routes were defined

const express = require('express');
const router = express.Router();
const User = require('../models/User');
// FIX: Import the protect middleware from the auth file
const { protect } = require('../middleware/auth'); 
// NOTE: We do not need to define verifyToken here, we use 'protect'

// ✅ GET all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users); // ✅ Always return an array
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// ✅ GET current logged-in user
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ UPDATE user profile
router.put('/:id', protect, async (req, res) => { /* ... */ });

// ✅ DELETE user
router.delete('/:id', protect, async (req, res) => { /* ... */ });

// FIX: Must export the router
module.exports = router;