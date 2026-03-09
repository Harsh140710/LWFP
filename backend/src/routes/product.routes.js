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
import { createBrand, createCategory, getAllBrands, getAllCategories } from "../controllers/taxonomy.controller.js";

const router = Router();

// routes/product.routes.js

// 1. Taxonomy (Static paths first)
router.route("/category").get(getAllCategories);
router.route("/category/create").post(createCategory);
router.route("/brand").get(getAllBrands);
router.route("/brand/create").post(createBrand);

// 2. Secured Product Actions (Static paths)
router.route("/").get(getAllProducts);
router.route("/create").post(verifyJWT, isAdmin, upload.array("images", 10), createProduct);

// 3. Dynamic IDs (Parameter paths LAST)
router.route("/:id").get(getProductById);
router.route("/update/:id").patch(verifyJWT, isAdmin, upload.array("images", 10), updateProduct);
router.route("/review/:id").put(verifyJWT, createProductReview);
router.route("/delete/:id").delete(verifyJWT, isAdmin, deleteProduct);

export default router;