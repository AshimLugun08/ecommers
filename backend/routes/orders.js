const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto'); // <-- FIX 1: Import the built-in 'crypto' module
const Order = require('../models/Order');
// FIX 2: Destructure 'protect' from the auth middleware object
const { protect } = require('../middleware/auth'); 

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
// FIX 2: Use the 'protect' middleware function
router.post('/', protect, async (req, res) => {
  try {
    // NOTE: In a complete application, you should validate the product prices/stock 
    // against the database here, not trust the price sent from the client.
    const { products, shippingAddress } = req.body;
    let totalAmount = 0;

    // Calculate total (validation needed here for production)
    for (const item of products) {
      totalAmount += item.price * item.quantity;
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // Ensure amount is an integer in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${req.user.id}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Save order in DB with initial status and Razorpay ID
    const order = new Order({
      user: req.user.id,
      products,
      totalAmount,
      shippingAddress,
      paymentId: razorpayOrder.id, // Store the Razorpay Order ID as paymentId
      status: 'pending', // Explicitly set status to pending before payment
    });
    await order.save();

    res.json({
      orderId: order._id, // Your internal MongoDB ID
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      message: 'Razorpay order created successfully for payment.'
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
});

// Get user orders
// FIX 2: Use the 'protect' middleware function
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 }); // Show most recent orders first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
// FIX 2: Use the 'protect' middleware function
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1. Create the string to sign
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    
    // 2. Generate expected signature using Hmac-SHA256
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // 3. Compare signatures
    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      await Order.findOneAndUpdate(
        { paymentId: razorpay_order_id, user: req.user.id }, // Add user check for security
        { status: 'paid' }
      );
      // NOTE: You should also update stock and clear the user's cart here.
      res.json({ message: 'Payment verified successfully' });
    } else {
      // Signature mismatch
      await Order.findOneAndUpdate(
        { paymentId: razorpay_order_id }, 
        { status: 'cancelled' } // Optionally update status to cancelled or failed
      );
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: error.message || 'Internal server error during verification' });
  }
});

module.exports = router;