const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/auth");

const PRODUCT_POPULATION_SELECT =
  "name price category description images sizes colors";
const USER_POPULATION_SELECT = "name email";

// -----------------------------------------------------------
// ✅ CREATE ORDER
// -----------------------------------------------------------
router.post("/", protect, async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentId } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress,
      paymentId,
    });

    await order.save();

    const populatedOrder = await order.populate({
      path: "products.product",
      select: PRODUCT_POPULATION_SELECT,
    });

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -----------------------------------------------------------
// ✅ GET ALL ORDERS (ADMIN)
// -----------------------------------------------------------
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "products.product",
        select: PRODUCT_POPULATION_SELECT,
      })
      .populate({
        path: "user",
        select: USER_POPULATION_SELECT,
      })
      .populate({
        path: "shippingAddress",
        model: "Address",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------
// ✅ GET USER'S ORDERS (USER PROFILE)
// -----------------------------------------------------------
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "products.product",
        select: PRODUCT_POPULATION_SELECT,
      })
      .populate({
        path: "shippingAddress",
        model: "Address",
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("User orders fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------
// ✅ UPDATE ORDER STATUS (ADMIN)
// -----------------------------------------------------------
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("products.product")
      .populate("user")
      .populate("shippingAddress");

    res.json({
      success: true,
      order: updated,
    });
  } catch (err) {
    console.error("Order status update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
