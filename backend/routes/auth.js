const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');

const router = express.Router();

// SendGrid transporter
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Generate random 6-digit code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Send verification code for registration/login
router.post('/send-verification-code', async (req, res) => {
  try {
    const { email, name } = req.body; // name is optional for registration
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save or update verification code with name if provided
    await VerificationCode.findOneAndUpdate(
      { email },
      { code, expiresAt, name: name || '' },
      { upsert: true, new: true }
    );

    // Send email
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <h2>Your Verification Code</h2>
        <p>Use the following code to verify your email:</p>
        <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true,
      message: 'Verification code sent to your email' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send verification code' 
    });
  }
});

// Verify code and register/login user
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    const verification = await VerificationCode.findOne({ email, code });
    if (!verification || verification.expiresAt < new Date()) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired code' 
      });
    }

    // Find or create user
    let user = await User.findOne({ email });
    const isNewUser = !user;

    if (!user) {
      // Create new user with name from verification if available
      user = new User({ 
        email, 
        name: verification.name || email.split('@')[0] // Default name
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Delete used code
    await VerificationCode.deleteOne({ email, code });

    res.json({
      success: true,
      access_token: token,
      token_type: 'bearer',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      isNewUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Verification failed' 
    });
  }
});

// Get user profile (protected route)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndUpdate(
      decoded.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    res.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Check if email exists (optional endpoint)
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    res.json({
      success: true,
      exists: !!user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;