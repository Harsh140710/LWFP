// controllers/order.controller.js
import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js"; // Required import
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      orderItems,
      paymentMethod,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentResponse
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items in request" });
    }

    // Update Stock
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
      isPaid: isCard,
      paidAt: isCard ? new Date() : null,
      // If card payment succeeded, you might want to store the stripe ID
      paymentResult: isCard ? {
        id: paymentResponse?.id,
        status: paymentResponse?.status,
      } : null,
      status: "pending",
    });

    await order.save();

    const io = req.app.get("io");
    if (io) io.emit("product-stock-updated");

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    // This prevents the "paymentResponse is not defined" ReferenceError
    console.error("Order Creation Error:", err);
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
// Admin: Get all orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("orderItems.product")
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// Admin: Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found in the ledger");
  }

  if (order.status === "delivered") {
    throw new ApiError(400, "Asset has already been delivered");
  }

  // Update status from the admin dropdown
  order.status = req.body.status;

  if (req.body.status === "delivered") {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  // Trigger real-time update via Socket.io
  const io = req.app.get("io");
  io.emit("orderUpdated", updatedOrder);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, `Order status moved to ${order.status}`));
});

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
    order.status = "processing";

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




