const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth'); // assuming you use JWT middleware

// Define the fields to select from the Product model
const PRODUCT_POPULATION_SELECT = 'name price category description images sizes colors';
const USER_POPULATION_SELECT = 'name email';

// ✅ Create Order
router.post('/', protect, async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentId } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }

    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress,
      paymentId,
    });

    await order.save();

    // 🔑 FIX: Update population selection to use 'images' array field
    const populatedOrder = await order.populate({
      path: 'products.product',
      select: PRODUCT_POPULATION_SELECT, // Using the corrected select string
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder,
    });
  } catch (error) {
    console.error('🔥 Order creation failed:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ✅ Get All Orders (Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'products.product',
        select: PRODUCT_POPULATION_SELECT, // 🔑 FIX APPLIED HERE
      })
      .populate({
        path: 'user',
        select: USER_POPULATION_SELECT,
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Orders by Logged-in User
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: PRODUCT_POPULATION_SELECT, // 🔑 FIX APPLIED HERE
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// (The Mongoose model definitions below are correct for the population logic above)

// const mongoose = require('mongoose');
// const orderItemSchema = new mongoose.Schema({...}, { _id: false });
// const orderSchema = new mongoose.Schema({...});
// module.exports = mongoose.model('Order', orderSchema);