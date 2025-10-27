// routes/products.js (Verified Clean)

const express = require('express');
const Product = require('../models/Product');
// Assuming your auth middleware exports an object like { protect: fn, admin: fn }
const auth = require('../middleware/auth'); 

const router = express.Router();

// ------------------------------------------------------------------
// IMPORTANT: This public route is where the CORS error was occurring.
// Since no manual headers are set here, the error MUST be fixed by 
// the global 'cors' middleware in server.js.
// ------------------------------------------------------------------

// Get all products (Public route)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    // Standard error handling
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

// Create product (Admin only)
// Uses array syntax for multiple middlewares: [protection, role check]
router.post('/', [auth.protect, auth.admin], async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', [auth.protect, auth.admin], async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (Admin only)
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