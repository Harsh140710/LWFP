"use client";

import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products = location.state?.products || [];

  const stripe = useStripe();
  const elements = useElements();

  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = products.reduce(
    (s, p) => s + (Number(p.price) || 0) * (p.quantity || 1),
    0
  );

  const handleChange = (e) =>
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstname, lastname, phone, address } = userDetails;
    if (!firstname || !lastname || !phone || !address) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (products.length === 0) {
      toast.error("No products in order.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const shippingPrice = 40;
      const taxPrice = 0;
      const totalPrice = subtotal + shippingPrice + taxPrice;

      const orderItems = products.map((p) => ({
        product: p._id || p.productId,
        name: p.title || p.name || "Product",
        quantity: Number(p.quantity) || 1,
        price: Number(p.price) || 0,
        image: p.images?.[0]?.url || "/placeholder.jpg",
      }));

      const payload = {
        customer: userDetails,
        orderItems,
        paymentMethod,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      // COD Payment
      if (paymentMethod === "cod") {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/orders/addOrderItems`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShowSuccess(true);
        toast.success("Order placed successfully!");
        navigate("/orders/history");
      }

      // Card Payment
      if (paymentMethod === "card") {
        if (!stripe || !elements) {
          toast.error("Stripe is loading. Please wait...");
          setLoading(false);
          return;
        }

        const { data: clientSecretData } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/payment/create-payment-intent`,
          { amount: totalPrice * 100 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecretData.clientSecret,
          { payment_method: { card: cardElement } }
        );

        if (error) {
          toast.error(error.message || "Payment failed");
          setLoading(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/v1/orders/addOrderItems`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setShowSuccess(true);
          toast.success("Payment successful and order placed!");
          navigate("/orders/history");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black dark:text-white">
        No products to checkout
      </div>
    );
  }

  return (
    <FieldSet className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <FieldLegend>Shipping & Payment</FieldLegend>
      <FieldDescription>
        Please provide your shipping address and payment details
      </FieldDescription>

      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="firstname">First Name</FieldLabel>
            <FieldContent>
              <input
                id="firstname"
                required
                name="firstname"
                value={userDetails.firstname}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </FieldContent>
            <FieldDescription>Your first name</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
            <FieldContent>
              <input
                id="lastname"
                required
                name="lastname"
                value={userDetails.lastname}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </FieldContent>
            <FieldDescription>Your last name</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <FieldContent>
              <input
                id="phone"
                required
                name="phone"
                value={userDetails.phone}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </FieldContent>
            <FieldDescription>Your contact number</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <FieldContent>
              <input
                id="city"
                name="city"
                value={userDetails.city}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </FieldContent>
            <FieldDescription>Your city</FieldDescription>
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <FieldContent>
              <textarea
                id="address"
                required
                name="address"
                value={userDetails.address}
                onChange={handleChange}
                className="p-3 border rounded w-full"
              />
            </FieldContent>
            <FieldDescription>
              Billing or shipping address associated with your order
            </FieldDescription>
          </Field>
        </FieldGroup>

        {/* Payment Method */}
        <Field>
          <FieldLabel>Payment Method</FieldLabel>
          <FieldDescription>Choose how you want to pay</FieldDescription>
          <FieldGroup className="flex gap-6 mt-2">
            <Field orientation="horizontal">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <FieldLabel htmlFor="card">Card / UPI / Netbanking</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <FieldLabel htmlFor="cod">Cash on Delivery</FieldLabel>
            </Field>
          </FieldGroup>
        </Field>

        {/* Card Details */}
        {paymentMethod === "card" && (
          <Field>
            <FieldLabel>Card Details</FieldLabel>
            <FieldDescription>
              Enter your 16-digit card number, expiry, and CVC
            </FieldDescription>
            <FieldContent>
              <div className="p-3 border rounded">
                <CardElement />
              </div>
            </FieldContent>
          </Field>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-2"
        >
          {loading && <span className="loading loading-spinner loading-sm"></span>}
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </FieldSet>
  );
};

export default Payment;
