const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Fields to select from Product
const PRODUCT_POPULATION_SELECT =
  'name price category description images sizes colors';

// Fields to select from User
const USER_POPULATION_SELECT = 'name email';

/* ------------------------------------------------------
   ✅ CREATE ORDER (User)
------------------------------------------------------ */
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
      shippingAddress, // <-- address ID coming from frontend
      paymentId,
    });

    await order.save();

    const populatedOrder = await order.populate([
      {
        path: 'products.product',
        select: PRODUCT_POPULATION_SELECT,
      },
      {
        path: 'shippingAddress', // ⭐ ADD
      },
    ]);

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder,
    });
  } catch (error) {
    console.error('🔥 Order creation failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/* ------------------------------------------------------
   ✅ GET ALL ORDERS (Admin Dashboard)
------------------------------------------------------ */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'products.product',
        select: PRODUCT_POPULATION_SELECT,
      })
      .populate({
        path: 'user',
        select: USER_POPULATION_SELECT,
      })
      .populate('shippingAddress') // ⭐ IMPORTANT
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ------------------------------------------------------
   ✅ GET USER ORDERS
------------------------------------------------------ */
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: PRODUCT_POPULATION_SELECT,
      })
      .populate('shippingAddress') // ⭐ IMPORTANT
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ------------------------------------------------------
   ✅ UPDATE ORDER STATUS (Admin)
------------------------------------------------------ */
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate({
        path: 'products.product',
        select: PRODUCT_POPULATION_SELECT,
      })
      .populate({
        path: 'user',
        select: USER_POPULATION_SELECT,
      })
      .populate('shippingAddress');

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Order status update failed:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
