import express from "express";
import { deleteReview, getAdminPayments, getAdminStats, getAllOrders, getAllReviews, markOrderAsPaid, updateOrderStatus } from "../controllers/admin.controller.js";
// import { updateOrderToPaid } from "../controllers/order.controller.js";

const router = express.Router();

// Temporary middleware (replace with real admin auth later)
const isAdmin = (req, res, next) => next();

router.get("/stats", isAdmin, getAdminStats);
router.get("/orders", getAllOrders);
// router.patch("/orders/:id/status", updateOrderStatus);
router.get("/payments", getAdminPayments);
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);
router.patch("/orders/:id/mark-paid", markOrderAsPaid);

router.patch("/orders/:id/status", updateOrderStatus);




export default router;
