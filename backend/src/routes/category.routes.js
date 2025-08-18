import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; // Import Multer middleware
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js"; // Import auth middlewares

const router = Router();

// unsecured routes
router.route("/").get(getAllCategories);

// Get a single category by ID
router.route("/:id").get(getCategoryById);

// secured Routes

// Create a new category
// Expects a single file named 'image' for the category icon/banner
router.route("/").post(verifyJWT,isAdmin,upload.single("image"),createCategory);

// Update a category by ID
// Allows updating fields and potentially changing the category image
router.route("/:id").patch(verifyJWT,isAdmin,upload.single("image"), updateCategory);

// Delete a category by ID
router.route("/:id").delete(verifyJWT,isAdmin,deleteCategory);


export default router;