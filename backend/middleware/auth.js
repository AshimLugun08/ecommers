// C:\Users\asus\Downloads\ifm\project\backend\middleware\auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
    token = req.headers.authorization.split(' ')[1];
    console.log("Incoming Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        console.log("User not found for ID:", decoded.id);
        return res.status(401).json({ message: 'User not found for this token.' });
    }

    req.user = user;
    next();
} catch (error) {
    console.error('JWT Verification Failed:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
}

    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

// FIX: Export 'protect' as 'verifyAuth' for routes/auth.js consistency
module.exports = { 
    protect, 
    admin,
    verifyAuth: protect 
};