import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/v1/payment/create-payment-intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in smallest currency unit (e.g., cents)
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr", // change if needed
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "PaymentIntent creation failed", error });
  }
});

export default router;
