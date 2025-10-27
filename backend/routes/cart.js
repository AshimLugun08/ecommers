const express = require('express');
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

// GET user's cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images price');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity, size, color, priceAtTimeOfAddition } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ✅ Fix image issue: check array of objects or fallback
    const imageUrl =
      (Array.isArray(product.images) && product.images[0]?.url) ||
      product.image ||
      '';

    const itemPrice = priceAtTimeOfAddition || product.price;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        priceAtTimeOfAddition: itemPrice,
        image: imageUrl, // ✅ Store proper image URL
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price');

    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE cart item quantity
router.put('/update/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId); // ✅ Access by item _id
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name images price');
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// REMOVE item from cart
router.delete('/remove/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name images price');
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
