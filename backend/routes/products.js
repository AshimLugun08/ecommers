const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth'); // 'auth' is now the object: { protect, admin }

const router = express.Router();

// Get all products (Public route)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID (Public route)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Admin only - FIX applied here)
// We pass an array of middleware functions: [auth.protect, auth.admin]
router.post('/', [auth.protect, auth.admin], async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (Admin only - FIX applied here)
// We pass an array of middleware functions: [auth.protect, auth.admin]
router.put('/:id', [auth.protect, auth.admin], async (req, res) => {
  try {
    // Note: In a real-world scenario, you might want to perform role checks
    // on the Product model fields before updating.
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (Admin only - FIX applied here)
// We pass an array of middleware functions: [auth.protect, auth.admin]
router.delete('/:id', [auth.protect, auth.admin], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;