import express from 'express';

const router = express.Router();

import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';
import {
    createProductReview,
    getProductReviews,
    deleteReview,
} from '../controllers/review.controller.js';


router.route('/create-product-review').post(verifyJWT, createProductReview);

router.route('/product/:productId').get(getProductReviews);

// DELETE /api/v1/reviews/:id - Delete a review (Private/User or Admin)
router.route('/:id').delete(verifyJWT, deleteReview);


export default router;