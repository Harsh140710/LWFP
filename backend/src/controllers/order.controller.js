// controllers/order.controller.js
import { Order } from "../models/order.models.js";

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const { customer, orderItems, paymentMethod, shippingPrice, taxPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items in request" });
    }

    const order = new Order({
      customer,
      orderItems,
      paymentMethod,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user?._id,
    });

    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// Get order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.product");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("orderItems.product").sort({ createdAt: -1 });
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
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
