const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtTimeOfAddition: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String, // ✅ Added for product image
  },
}, { _id: true }); // ✅ Ensure each item gets its own _id

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [itemSchema], // ✅ Array of items, each with its own _id
  subTotal: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

cartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
