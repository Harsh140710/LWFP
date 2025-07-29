import express from 'express';

const router = express.Router();

import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    getCart,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart,
} from '../controllers/cart.controller.js';


// All cart routes require a logged-in user (Private)
router.route('/').get(verifyJWT, getCart);
router.route('/add').post(verifyJWT, addItemToCart);
router.route('/remove/:productId').delete(verifyJWT, removeItemFromCart);
router.route('/update-quantity').put(verifyJWT, updateCartItemQuantity);
router.route('/clear').delete(verifyJWT, clearCart);


export default router;