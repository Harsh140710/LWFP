import express from 'express';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getAllOrders,
} from '../controllers/order.controller.js';

const router = express.Router();

// all people can access routes
router.route('/addOrderItems').post(verifyJWT, addOrderItems);
router.route('/my-orders').get(verifyJWT, getMyOrders);
router.route('/:id').get(verifyJWT, getOrderById);
router.route('/:id/pay').put(verifyJWT, updateOrderToPaid);

// only admin can access this routes
router.route('/:id/deliver').put(verifyJWT, isAdmin, updateOrderToDelivered);
router.route('/').get(verifyJWT, isAdmin, getAllOrders);

export default router;