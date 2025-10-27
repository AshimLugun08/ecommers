const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth'); 

const router = express.Router();

// Create order (without payment)router.post('/', protect, async (req, res) => {
  router.post('/', protect, async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;
    if (!products || products.length === 0)
      return res.status(400).json({ message: 'No products provided' });

    let totalAmount = 0;
    products.forEach(item => totalAmount += item.price * item.quantity);

    // Save order directly in DB (skip Razorpay for now)
    const order = new Order({
      user: req.user.id,
      products,
      totalAmount,
      shippingAddress,
      status: 'pending', // or 'paid' if you want
    });

    await order.save();
    res.json({ orderId: order._id, message: 'Order created successfully' });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
});



// Get all orders for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 }); // recent orders first
    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
