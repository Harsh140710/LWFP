import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/category.models.js";
import { Brand } from "../models/brand.models.js"; // If you have a Brand model

// CATEGORY CONTROLLERS
export const createCategory = asyncHandler(async (req, res) => {
    const { name, slug } = req.body;
    if (!name) throw new ApiError(400, "Category name is required");

    const category = await Category.create({ 
        name, 
        slug: slug || name.toLowerCase().split(' ').join('-') 
    });

    return res.status(201).json(new ApiResponse(201, category, "Category created"));
});

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched"));
});

// BRAND CONTROLLERS 
// Note: Since your Product schema stores brand as a String, this model 
// acts as a "helper" for your UI dropdowns.
export const createBrand = asyncHandler(async (req, res) => {
    const { name, slug } = req.body;
    if (!name) throw new ApiError(400, "Brand name is required");

    const brand = await Brand.create({ name, slug });
    return res.status(201).json(new ApiResponse(201, brand, "Brand registered"));
});

export const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    return res.status(200).json(new ApiResponse(200, brands, "Brands fetched"));
});