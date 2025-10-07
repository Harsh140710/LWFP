// models/order.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String },
      pincode: { type: String },
    },
    orderItems: [orderItemSchema],
    paymentMethod: { type: String, enum: ["card", "cod"], default: "cod" },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional: link order to user
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
