// controllers/order.controller.js
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js"; // ✅ Required import

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const { customer, orderItems, paymentMethod, shippingPrice, taxPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items in request" });
    }

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const isCard = paymentMethod === "card";

    const order = new Order({
      customer,
      orderItems,
      paymentMethod,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user?._id,
      isPaid: isCard, // Card orders are immediately paid
      paidAt: isCard ? new Date() : null,
      status: isCard ? "delivered" : "pending",
    });

    await order.save();

    const io = req.app.get("io");
    if (io) io.emit("product-stock-updated");

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// Get order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.product");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    //Handle stock restoration if order is canceled or returned
    if (status === "canceled" || status === "returned") {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    // Emit socket event for real-time stock update
    const io = req.app.get("io");
    if (io) io.emit("product-stock-updated");

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// Mark Order as Paid (Admin only)
export const markOrderAsPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update fields
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "COMPLETED";

    await order.save();

    // Emit real-time update via Socket.io
    const io = req.app.get("io");
    io.emit("orderUpdated", {
      orderId: order._id,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      status: order.status,
    });

    res.json({ success: true, message: "Order marked as paid", data: order });
  } catch (err) {
    next(err);
  }
};

// Get orders for logged-in user
export const getUserOrders = async (req, res, next) => {
  try {
    console.log("req.user:", req.user);
    const userId = req.user?._id;

    if (!userId) {
      console.log("No user ID found in request");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("getUserOrders error:", err);
    next(err);
  }
};




