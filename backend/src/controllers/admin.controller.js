import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";
import { Review } from "../models/review.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAdminStats = async (req, res) => {
  try {
    // ===== Totals =====
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // ===== Total Revenue =====
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    // ===== Monthly Sales =====
    const monthlySalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
        },
      },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const monthlySales = monthlySalesAgg.map((m) => ({
      year: m._id.year,
      month: m._id.month,
      revenue: m.revenue,
    }));

    // ===== Category Distribution =====
    const categoryAgg = await Product.aggregate([
      {
        $group: {
          _id: "$category", // change if your category is ObjectId
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const categoryDistribution = categoryAgg.map((c) => ({
      category: c.name || "Uncategorized",
      count: c.count,
    }));

    // ===== Response =====
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        monthlySales,
        categoryDistribution,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin stats",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "orderItems.product",
        select: "name price",
      })
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      user: order.user
        ? { name: order.user.name, email: order.user.email }
        : null,
      totalPrice: order.totalPrice,
      status: order.status || "pending", // Ensure status exists
      createdAt: order.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;

    // Auto-mark paid when delivered
    if (status === "delivered") {
        order.isPaid = true;
        order.paidAt = Date.now();
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
};


export const getAdminPayments = asyncHandler(async (req, res) => {
  // Auto-update COD orders older than 10 days
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  await Order.updateMany(
    {
      paymentMethod: "cod",
      isPaid: false,
      createdAt: { $lte: tenDaysAgo },
    },
    {
      $set: {
        isPaid: true,
        paidAt: new Date(),
      },
    }
  );

  // Fetch payments after auto-update
  const payments = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  const formattedPayments = payments.map((order) => ({
    _id: order._id,
    user: order.user
      ? { name: order.user.name, email: order.user.email }
      : null,
    paymentMethod: order.paymentMethod || "cod",
    totalPrice: order.totalPrice,
    isPaid: order.isPaid,
    paidAt: order.paidAt,
    status: order.status || "pending",
    createdAt: order.createdAt,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(200, formattedPayments, "Payments fetched successfully")
    );
});

export const markOrderAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Mark as paid
    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order marked as paid successfully",
      data: order,
    });
  } catch (error) {
    console.error("Mark as paid error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark order as paid",
    });
  }
};


export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({ path: "user", select: "name email" })
      .populate({ path: "product", select: "name" })
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      product: review.product ? review.product.name : "Product Deleted",
      user: review.user
        ? { name: review.user.name, email: review.user.email }
        : null,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));

    res.status(200).json({ success: true, data: formattedReviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await Review.deleteOne({ _id: id });

    return res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};
