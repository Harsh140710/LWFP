import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Order } from '../modules/order.modules.js';
import { Product } from '../modules/product.modules.js';

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        // Use ApiError for specific HTTP status codes and messages
        throw new ApiError(400, 'No order items in the request');
    } else {
        // Validate if all products in orderItems exist and update stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new ApiError(404, `Product with ID ${item.product} not found`);
            }
            if (product.stock < item.qty) {
                throw new ApiError(400, `Not enough stock for ${product.title}. Available: ${product.stock}`);
            }
            // Decrement stock
            product.stock -= item.qty;
            await product.save({ validateBeforeSave: false }); // Bypass validation on save if only updating stock
        }

        const order = new Order({
            user: req.user._id, // User ID from JWT payload attached by auth middleware
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        
        // Using your ApiResponse for a successful creation response
        res.status(201).json(new ApiResponse(201, createdOrder, 'Order placed successfully'));
    }
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'username email fullname'); // Populate user details

    if (order) {
        // Ensure only the owner or an admin can view the order
        if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
            res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully'));
        } else {
            throw new ApiError(403, 'Not authorized to view this order'); // Forbidden
        }
    } else {
        throw new ApiError(404, 'Order not found');
    }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        // Check if order is already paid to prevent double payment attempts causing issues
        if (order.isPaid) {
            throw new ApiError(400, 'Order already paid');
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        // These details would come from your actual payment gateway response
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.status(200).json(new ApiResponse(200, updatedOrder, 'Order marked as paid'));
    } else {
        throw new ApiError(404, 'Order not found');
    }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        // Check if order is already delivered
        if (order.isDelivered) {
            throw new ApiError(400, 'Order already delivered');
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(new ApiResponse(200, updatedOrder, 'Order marked as delivered'));
    } else {
        throw new ApiError(404, 'Order not found');
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(new ApiResponse(200, orders, 'User orders fetched successfully'));
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id username email fullname');
    res.status(200).json(new ApiResponse(200, orders, 'All orders fetched successfully'));
});


export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getAllOrders,
};