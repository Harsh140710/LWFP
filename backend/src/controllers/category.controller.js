import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../modules/category.modules.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.js";
import fs from 'fs';
import mongoose from "mongoose";

// Helper function to delete local files (for category image)
const deleteLocalFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const createCategory = asyncHandler(async (req, res) => {
    const { name, description, parentCategory } = req.body;
    const categoryImageLocalPath = req.file?.path; // Multer provides single file in req.file

    // 1. Basic Validation: Check for required fields
    if (!name || name.trim() === "") {
        deleteLocalFile(categoryImageLocalPath); // Clean up temp file if name is missing
        throw new ApiError(400, "Category name is required.");
    }

    // 2. Check if category with same name already exists (case-insensitive)
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
        deleteLocalFile(categoryImageLocalPath);
        throw new ApiError(409, "Category with this name already exists.");
    }

    // 3. Validate parentCategory ID and existence if provided
    let parentCategoryId = null;
    if (parentCategory) {
        if (!mongoose.isValidObjectId(parentCategory)) {
            deleteLocalFile(categoryImageLocalPath);
            throw new ApiError(400, "Invalid parentCategory ID format.");
        }
        const existingParentCategory = await Category.findById(parentCategory);
        if (!existingParentCategory) {
            deleteLocalFile(categoryImageLocalPath);
            throw new ApiError(404, "Parent category not found for the provided ID.");
        }
        parentCategoryId = parentCategory;
    }

    // 4. Handle image upload if a file is provided
    let image = {};
    if (categoryImageLocalPath) {
        const cloudinaryResponse = await uploadOnCloudinary(categoryImageLocalPath);
        if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
            // No need to delete from Cloudinary as upload failed
            deleteLocalFile(categoryImageLocalPath); // Clean up local temp file
            throw new ApiError(500, "Failed to upload category image to Cloudinary.");
        }
        image = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        };
        
        deleteLocalFile(categoryImageLocalPath); // Clean up local temp file after successful upload
    }

    // 5. Create Category
    const category = await Category.create({
        name,
        description: description || '', // Default to empty string if not provided
        image: image.public_id ? image : undefined, // Only save if public_id exists
        parentCategory: parentCategoryId,
        createdBy: req.user?._id, // Assuming req.user is set by verifyJWT middleware
    });

    if (!category) {
        // If category creation fails, attempt to delete uploaded image from Cloudinary
        if (image.public_id) {
            await deleteFromCloudinary(image.public_id);
        }
        throw new ApiError(500, "Something went wrong while creating the category.");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully."));
});

const getAllCategories = asyncHandler(async (req, res) => {
    // Optionally filter by parentCategory to get subcategories, or get all top-level
    const query = {};
    if (req.query.parentCategory) {
        if (!mongoose.isValidObjectId(req.query.parentCategory)) {
            throw new ApiError(400, "Invalid parentCategory ID format.");
        }
        query.parentCategory = req.query.parentCategory;
    } else if (req.query.topLevel === 'true') { // To get only categories without a parent
        query.parentCategory = null;
    }

    // Populate parentCategory details for nested categories
    const categories = await Category.find(query)
                                    .populate('parentCategory', 'name slug')
                                    .sort({ name: 1 }); // Sort by name

    if (!categories || categories.length === 0) {
        throw new ApiError(404, "No categories found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories fetched successfully."));
});

const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid category ID format.");
    }

    const category = await Category.findById(id).populate('parentCategory', 'name slug');

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category fetched successfully."));
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, parentCategory } = req.body;
    const categoryImageLocalPath = req.file?.path;

    if (!mongoose.isValidObjectId(id)) {
        deleteLocalFile(categoryImageLocalPath);
        throw new ApiError(400, "Invalid category ID format.");
    }

    const category = await Category.findById(id);

    if (!category) {
        deleteLocalFile(categoryImageLocalPath);
        throw new ApiError(404, "Category not found.");
    }

    // Prevent a category from being its own parent or a parent to its own child (circular dependency)
    if (parentCategory && parentCategory.toString() === id.toString()) {
        deleteLocalFile(categoryImageLocalPath);
        throw new ApiError(400, "A category cannot be its own parent.");
    }

    // Validate parentCategory if provided
    let newParentCategoryId = category.parentCategory; // Keep current if not updated
    if (parentCategory) {
        if (!mongoose.isValidObjectId(parentCategory)) {
            deleteLocalFile(categoryImageLocalPath);
            throw new ApiError(400, "Invalid parentCategory ID format.");
        }
        const existingParentCategory = await Category.findById(parentCategory);
        if (!existingParentCategory) {
            deleteLocalFile(categoryImageLocalPath);
            throw new ApiError(404, "Parent category not found for the provided ID.");
        }
        newParentCategoryId = parentCategory;
    } else if (parentCategory === null) { // Explicitly set to top-level
        newParentCategoryId = null;
    }

    // Handle new image upload
    let newImageUrl = category.image?.url;
    let newImagePublicId = category.image?.public_id;

    if (categoryImageLocalPath) {
        const cloudinaryResponse = await uploadOnCloudinary(categoryImageLocalPath);
        if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
            deleteLocalFile(categoryImageLocalPath);
            throw new ApiError(500, "Failed to upload new category image to Cloudinary.");
        }

        // If there was an old image, delete it from Cloudinary
        if (category.image && category.image.public_id) {
            await deleteFromCloudinary(category.image.public_id);
        }

        newImageUrl = cloudinaryResponse.secure_url;
        newImagePublicId = cloudinaryResponse.public_id;
        deleteLocalFile(categoryImageLocalPath);
    } else if (req.body.image === 'null' || req.body.image === '') { // Explicitly remove image
        if (category.image && category.image.public_id) {
            await deleteFromCloudinary(category.image.public_id);
        }
        newImageUrl = undefined;
        newImagePublicId = undefined;
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description; // Allow empty string update
    category.parentCategory = newParentCategoryId;
    category.image = newImagePublicId ? { public_id: newImagePublicId, url: newImageUrl } : undefined;

    await category.save({ validateBeforeSave: true }); // Slug will regenerate if name changed

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully."));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid category ID format.");
    }

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found.");
    }

    // Optional: Check for child categories or products before deletion
    // If you want to prevent deletion if there are child categories:
    const childCategories = await Category.countDocuments({ parentCategory: id });
    if (childCategories > 0) {
        throw new ApiError(400, `Cannot delete category: ${childCategories} sub-categories exist.`);
    }

    // If you want to prevent deletion if there are products linked to it:
    // import { Product } from "../models/product.model.js"; // Need to import Product model
    // const linkedProducts = await Product.countDocuments({ category: id });
    // if (linkedProducts > 0) {
    //     throw new ApiError(400, `Cannot delete category: ${linkedProducts} products are linked to it.`);
    // }


    // Delete associated image from Cloudinary
    if (category.image && category.image.public_id) {
        await deleteFromCloudinary(category.image.public_id);
    }

    await category.deleteOne(); // Or findByIdAndDelete(id)

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Category deleted successfully."));
});

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};