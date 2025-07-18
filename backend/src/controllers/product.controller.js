import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../modules/product.modules.js";
import { Category } from "../modules/category.modules.js"; // Import Category model
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.js";
import fs from 'fs'; // For file system operations (deleting local temp files)
import mongoose from "mongoose"; // For isValidObjectId

// Helper function to delete local files
const deleteLocalFiles = (files) => {
    if (files && files.length > 0) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
    }
};

const createProduct = asyncHandler(async (req, res) => {
    const { title, description, brand, price, discountPrice, stock, category, isFeatured } = req.body;
    let productImages = []; // Array to store Cloudinary image details

    // 1. Basic Validation: Check for required fields
    if (
        [title, description, brand, price, stock, category].some(
            (field) => field?.trim() === "" || field === undefined
        )
    ) {
        // Clean up any uploaded local files if validation fails
        if (req.files && req.files.length > 0) {
            deleteLocalFiles(req.files);
        }
        throw new ApiError(400, "All required product fields (title, description, brand, price, stock, category) are mandatory.");
    }

    // 2. Validate Category ID and existence
    if (!mongoose.isValidObjectId(category)) {
        deleteLocalFiles(req.files);
        throw new ApiError(400, "Invalid category ID format.");
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
        deleteLocalFiles(req.files);
        throw new ApiError(404, "Category not found for the provided ID.");
    }

    // 3. Handle image uploads
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "At least one product image is required.");
    }

    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
    const cloudinaryResponses = await Promise.all(uploadPromises);

    // Filter out failed uploads and collect successful ones
    const successfulUploads = cloudinaryResponses.filter(response => response && response.secure_url);

    if (successfulUploads.length === 0) {
        // Clean up all local files if all Cloudinary uploads failed
        deleteLocalFiles(req.files);
        throw new ApiError(500, "Failed to upload any product images to Cloudinary.");
    }

    productImages = successfulUploads.map(response => ({
        public_id: response.public_id,
        url: response.secure_url
    }));

    // Clean up local temporary files after Cloudinary upload attempt
    deleteLocalFiles(req.files);

    // 4. Create Product
    const product = await Product.create({
        title,
        description,
        brand,
        price,
        discountPrice: discountPrice || 0, // Ensure default if not provided
        stock,
        category,
        images: productImages,
        isFeatured: isFeatured || false,
        createdBy: req.user?._id, // Assuming req.user is set by verifyJWT middleware
    });

    if (!product) {
        // If product creation fails, attempt to delete uploaded images from Cloudinary
        for (const img of productImages) {
            await deleteFromCloudinary(img.public_id);
        }
        throw new ApiError(500, "Something went wrong while creating the product.");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully."));
});

const getAllProducts = asyncHandler(async (req, res) => {
    // Implement filtering, searching, pagination, sorting here
    // For now, a simple fetch all is provided

    const query = {};
    // Example filtering by category (if provided in query params)
    if (req.query.category) {
        query.category = req.query.category; // Assuming category ID is passed
    }
    // Example filtering by brand
    if (req.query.brand) {
        query.brand = req.query.brand;
    }
    // Example price range
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = req.query.minPrice;
        if (req.query.maxPrice) query.price.$lte = req.query.maxPrice;
    }

    // Basic search (if text index is enabled in model)
    if (req.query.keyword) {
        query.$text = { $search: req.query.keyword };
    }

    const products = await Product.find(query).populate('category', 'name slug').sort({ createdAt: -1 });

    if (!products || products.length === 0) {
        throw new ApiError(404, "No products found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, products, "Products fetched successfully."));
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid product ID format.");
    }

    // Populate category and review user details for a complete product view
    const product = await Product.findById(id)
                                .populate('category', 'name slug description')
                                .populate('reviews.user', 'fullname email avatar');

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully."));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, brand, price, discountPrice, stock, category, isFeatured } = req.body;
    let newImages = []; // To store new images uploaded
    const fieldsToUpdate = { title, description, brand, price, discountPrice, stock, isFeatured };

    if (!mongoose.isValidObjectId(id)) {
        deleteLocalFiles(req.files);
        throw new ApiError(400, "Invalid product ID format.");
    }

    // If category is being updated, validate it
    if (category) {
        if (!mongoose.isValidObjectId(category)) {
            deleteLocalFiles(req.files);
            throw new ApiError(400, "Invalid category ID format.");
        }
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            deleteLocalFiles(req.files);
            throw new ApiError(404, "Category not found for the provided ID.");
        }
        fieldsToUpdate.category = category;
    }

    const product = await Product.findById(id);

    if (!product) {
        deleteLocalFiles(req.files);
        throw new ApiError(404, "Product not found.");
    }

    // Handle new image uploads (if any)
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const cloudinaryResponses = await Promise.all(uploadPromises);

        const successfulUploads = cloudinaryResponses.filter(response => response && response.secure_url);

        if (successfulUploads.length > 0) {
            newImages = successfulUploads.map(response => ({
                public_id: response.public_id,
                url: response.secure_url
            }));
            // Add new images to the existing ones
            product.images.push(...newImages);
        }
        // Clean up local temporary files
        deleteLocalFiles(req.files);
    }

    // Handle deletion of old images if public_ids are sent in the request body (e.g., as an array `imagesToDelete`)
    // You would typically send an array of public_ids for images to remove
    if (req.body.imagesToDelete && Array.isArray(req.body.imagesToDelete)) {
        const publicIdsToDelete = req.body.imagesToDelete;
        for (const publicId of publicIdsToDelete) {
            await deleteFromCloudinary(publicId);
            // Remove from product.images array
            product.images = product.images.filter(img => img.public_id !== publicId);
        }
    }

    // Update other product fields
    Object.assign(product, fieldsToUpdate); // Update fields dynamically

    await product.save({ validateBeforeSave: true }); // Save the updated product

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product updated successfully."));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid product ID format.");
    }

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    // Delete all associated images from Cloudinary
    for (const image of product.images) {
        await deleteFromCloudinary(image.public_id);
    }

    await product.deleteOne(); // Use deleteOne() or findByIdAndDelete()

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Product deleted successfully."));
});

const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { id } = req.params; // Product ID

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid product ID format.");
    }
    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating is required and must be between 1 and 5.");
    }

    const product = await Product.findById(id);

    if (!product) {
        throw new new ApiError(404, "Product not found.");
    }

    const review = {
        user: req.user._id, // User ID from authenticated request
        name: req.user.fullname, // User's full name from authenticated request
        rating: Number(rating),
        comment,
    };

    const isReviewed = product.reviews.find(
        (rev) => rev.user && rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        // Update existing review
        isReviewed.rating = rating;
        isReviewed.comment = comment;
        isReviewed.createdAt = Date.now(); // Update timestamp on modification
    } else {
        // Add new review
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
    }

    // Calculate average rating
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: true }); // Save the updated product

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Review added/updated successfully."));
});

const deleteProductReview = asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.params;

    if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(reviewId)) {
        throw new ApiError(400, "Invalid product or review ID format.");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    // Filter out the review to be deleted
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== reviewId.toString()
    );

    // Check if the review actually existed and was removed
    if (reviews.length === product.reviews.length) {
        throw new ApiError(404, "Review not found.");
    }

    // Re-calculate ratings and numReviews after deletion
    const numReviews = reviews.length;
    let ratings = 0;

    if (numReviews > 0) {
        reviews.forEach((rev) => {
            ratings += rev.rating;
        });
        ratings = ratings / numReviews;
    } else {
        ratings = 0; // If no reviews left, set ratings to 0
    }

    // Update the product
    product.reviews = reviews;
    product.numReviews = numReviews;
    product.ratings = ratings;

    await product.save({ validateBeforeSave: true });

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Review deleted successfully."));
});


export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview,
    deleteProductReview
};