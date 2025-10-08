// routes/order.routes.js
import express from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getUserOrders,
} from "../controllers/order.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Users
router.post("/addOrderItems", verifyJWT, createOrder);
router.get("/my-orders", verifyJWT ,getUserOrders);
router.get("/:id", verifyJWT, getOrderById);
// Admin
router.get("/", verifyJWT, isAdmin, getAllOrders);
router.put("/:id/status", verifyJWT, updateOrderStatus);

export default router;
