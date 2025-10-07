import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Order } from '../models/order.models.js';
import { Product } from '../models/product.models.js';

// Add new order
const addOrderItems = asyncHandler(async (req, res) => {
  const { customer, products, paymentMethod } = req.body;

  if (!products || products.length === 0) {
    throw new ApiError(400, 'No order items in request');
  }

  // Validate products exist and stock
  const orderItems = [];
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) throw new ApiError(404, `Product ${item.title} not found`);
    if (product.stock < (item.quantity || 1)) {
      throw new ApiError(400, `Not enough stock for ${product.title}`);
    }
    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });

    orderItems.push({
      name: product.title,
      qty: item.quantity,
      image: product.image,
      price: product.price,
      product: product._id,
    });
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress: {
      address: customer.address,
      city: customer.city,
      postalCode: customer.pincode,
      country: 'India', // or from form
    },
    paymentMethod,
    taxPrice: 0,
    shippingPrice: 40,
    totalPrice: orderItems.reduce((acc, i) => acc + i.price * i.qty, 0) + 40,
  });

  const createdOrder = await order.save();
  res.status(201).json(new ApiResponse(201, createdOrder, 'Order placed successfully'));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'username email fullname');
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully'));
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'processing';
  order.paymentResult = req.body;
  const updatedOrder = await order.save();
  res.status(200).json(new ApiResponse(200, updatedOrder, 'Order marked as paid'));
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json(new ApiResponse(200, updatedOrder, 'Order delivered'));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(new ApiResponse(200, orders, 'User orders fetched'));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id username email fullname');
  res.status(200).json(new ApiResponse(200, orders, 'All orders fetched'));
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
};
