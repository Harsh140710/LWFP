import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; // Import Multer middleware
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview,
    deleteProductReview
} from "../controllers/product.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js"; // Import auth middlewares

const router = Router();

// unsecured Routes
router.route("/").get(getAllProducts);
// Get a single product by ID
router.route("/:id").get(getProductById);


// secured Routes

// Create a new product
router.route("/create").post(verifyJWT,isAdmin,upload.array("images", 10),createProduct);

// Update a product by ID
// Allows updating fields and potentially adding new images
router.route("/update/:id").patch(verifyJWT,isAdmin,upload.array("images", 10),updateProduct);

// Delete a product by ID
router.route("/delete/:id").delete(verifyJWT,isAdmin,deleteProduct);

// --- Authenticated User Routes (Requires verifyJWT middleware) ---
// Create or update a review for a product
// :id here refers to the productId
router.route("/review/:id").put(verifyJWT, createProductReview);

// Delete a specific review for a product
// :productId is the product ID, :reviewId is the specific review ID
router.route("/review/:productId/:reviewId").delete(verifyJWT,deleteProductReview);


export default router;