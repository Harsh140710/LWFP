import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Review } from '../models/review.models.js';
import { Product } from '../models/product.models.js';

const updateProductRating = async (productId) => {
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    const averageRating = numReviews > 0 ? totalRating / numReviews : 0;


    await Product.findByIdAndUpdate(productId, {
        rating: averageRating,
        numReviews: numReviews,
    }, { new: true });
};

const createProductReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;
    const user = req.user._id; // User ID from JWT payload

    if (!productId || !rating) {
        throw new ApiError(400, 'Product ID and rating are required');
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    // Check if user already reviewed this product
    let review = await Review.findOne({ product: productId, user });

    if (review) {
        // If review exists, update it
        review.rating = rating;
        review.comment = comment || review.comment; // Allow updating comment or keeping old one

        await review.save();

        res.status(200).json(new ApiResponse(200, review, 'Review updated successfully'));

    } else {
        // Create new review
        review = await Review.create({
            product: productId,
            user,
            rating,
            comment,
        });


        res.status(201).json(new ApiResponse(201, review, 'Review added successfully'));
    }

    // Update product's overall rating and numReviews
    await updateProductRating(productId);
});

const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).populate('user', 'username avatar');

    if (!reviews) {
        throw new ApiError(404, 'Reviews not found for this product'); // Or just return empty array
    }

    res.status(200).json(new ApiResponse(200, reviews, 'Product reviews fetched successfully'));
});

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params; // Review ID
    const user = req.user;     // User object from JWT

    const review = await Review.findById(id);

    if (!review) {
        throw new ApiError(404, 'Review not found');
    }

    // Check if the user is the owner of the review OR if the user is an admin
    if (review.user.toString() !== user._id.toString() && user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized to delete this review');
    }

    await review.deleteOne(); // Use deleteOne() on the document instance

    // Update product's overall rating and numReviews after deletion
    await updateProductRating(review.product);

    res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'));
});

const getUserReviews = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const reviews = await Review.find({ user }).populate("product", "name title");
  res
    .status(200)
    .json(new ApiResponse(200, reviews, "User reviews fetched successfully"));
});


export {
    createProductReview,
    getProductReviews,
    deleteReview,
    getUserReviews
};