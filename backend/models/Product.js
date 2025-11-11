// C:\Users\asus\Downloads\ifm\project\backend\models\Product.js (or wherever your model is)

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // ✅ FIX 1: Change 'image' (single string) to 'images' (array of objects with url)
    images: [
      {
        url: { type: String, required: true },
        // You can add publicId here for Cloudinary deletion later if needed
      }
    ],
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    // ✅ FIX 2: Add optional sizes array (string array)
    sizes: [
      { type: String }
    ],
    // ✅ FIX 3: Add optional colors array (string array)
    colors: [
      { type: String }
    ],
  },
  {
    timestamps: true, // Uses Mongoose's built-in createdAt and updatedAt
  }
);

module.exports = mongoose.model('Product', productSchema);