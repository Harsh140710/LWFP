"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { formatPrice } from "@/utils/format";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// --- Order Form Component ---
const OrderForm = ({
  products,
  userDetails,
  setUserDetails,
  paymentMethod,
  setPaymentMethod,
  setShowSuccess,
  setProducts,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const subtotal = products.reduce(
    (s, p) => s + (Number(p.price) || 0) * (p.quantity || 1),
    0
  );

  const handleChange = (e) =>
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !userDetails.firstname ||
      !userDetails.lastname ||
      !userDetails.phone ||
      !userDetails.address
    ) {
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

      // Build orderItems with image for frontend use
      const orderItems = products
        .map((p) => ({
          product: p._id || p.productId,
          name: p.title || p.name || "Product",
          quantity: Number(p.quantity) || 1,
          price: Number(p.price) || 0,
          image: p.images?.[0]?.url || p.image || "/placeholder.jpg",
        }))
        .filter((item) => item.product);

      if (orderItems.length === 0) {
        toast.error("No valid products in order.");
        setLoading(false);
        return;
      }

      const payload = {
        customer: userDetails,
        orderItems,
        paymentMethod,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      // COD flow
      if (paymentMethod === "cod") {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/orders/addOrderItems`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShowSuccess(true);
      }

      // Card payment flow
      if (paymentMethod === "card") {
        if (!stripe || !elements) {
          toast.error("Stripe is loading. Please wait...");
          setLoading(false);
          return;
        }

        const { data: clientSecretData } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/payment/create-payment-intent`,
          { amount: totalPrice * 100 }, // cents
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
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 bg-white dark:bg-black border p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-black dark:text-gray-100">
        Shipping & Payment
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            required
            name="firstname"
            placeholder="First name"
            value={userDetails.firstname}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            required
            name="lastname"
            placeholder="Last name"
            value={userDetails.lastname}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            required
            name="phone"
            placeholder="Phone"
            value={userDetails.phone}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            name="city"
            placeholder="City"
            value={userDetails.city}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            name="pincode"
            placeholder="Pincode"
            value={userDetails.pincode}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </div>

        <textarea
          required
          name="address"
          placeholder="Full address"
          value={userDetails.address}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <div className="mt-3">
          <label className="font-medium">Payment method</label>
          <div className="flex gap-6 mt-2 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Card / UPI / Netbanking
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="border rounded mt-3">
            <CardElement className="text-gray-50 dark:bg-[#eee] p-5 rounded" />
          </div>
        )}

        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded w-full md:w-auto cursor-pointer"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Order Page Component ---
const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialProducts = location.state?.products || [];
  const [products, setProducts] = useState(initialProducts);
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      toast.error("No products selected.");
      navigate("/products");
    }
  }, [navigate, products.length]);

  const subtotal = products.reduce(
    (s, p) => s + (Number(p.price) || 0) * (p.quantity || 1),
    0
  );

  return (
    <>
      <Header />
      <div className="min-h-screen mt-18 bg-gray-50 dark:bg-black border py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          <Elements stripe={stripePromise}>
            <OrderForm
              products={products}
              userDetails={userDetails}
              setUserDetails={setUserDetails}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              setShowSuccess={setShowSuccess}
              setProducts={setProducts}
            />
          </Elements>

          {/* Right: Order Summary */}
          <aside className="bg-white dark:bg-black border p-4 rounded-lg shadow">
            <h3 className="font-semibold text-black dark:text-gray-100">
              Order summary
            </h3>
            <div className="mt-3 space-y-3">
              {products.map((p, idx) => (
                <div key={p._id || idx} className="flex items-center gap-3">
                  <img
                    src={
                      p.image
                        ? p.image.startsWith("http")
                          ? p.image
                          : `${import.meta.env.VITE_BASE_URL}${p.image}`
                        : "/placeholder.jpg"
                    }
                    alt={p.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {p.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(p.price)}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() =>
                          setProducts((prev) =>
                            prev.map((item, i) =>
                              i === idx
                                ? {
                                    ...item,
                                    quantity: Math.max(1, item.quantity - 1),
                                  }
                                : item
                            )
                          )
                        }
                        className="p-1 border rounded"
                      >
                        -
                      </button>
                      <div className="px-2">{p.quantity || 1}</div>
                      <button
                        onClick={() =>
                          setProducts((prev) =>
                            prev.map((item, i) =>
                              i === idx
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                            )
                          )
                        }
                        className="p-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatPrice((p.price || 0) * (p.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <div>Subtotal</div>
                <div>{formatPrice(subtotal)}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <div>Delivery</div>
                <div>{formatPrice(40)}</div>
              </div>
              <div className="flex justify-between text-lg font-bold mt-3">
                <div>Total</div>
                <div>{formatPrice(subtotal + 40)}</div>
              </div>
            </div>
          </aside>
        </div>

        {/* Success Popup */}
        {showSuccess && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-transparent border-2 p-8 rounded-4xl shadow-lg flex flex-col items-center animate-scaleUp w-80">
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-green-500 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-green-600 text-center">
                Order Placed!
              </h2>
              <p className="text-gray-700 dark:text-gray-200 text-center mb-4">
                Your order has been received successfully.
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/products");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 cursor-pointer rounded-xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        <style>
          {`
          .animate-scaleUp {
            animation: scaleUp 0.3s ease-out;
          }
          @keyframes scaleUp {
            0% { transform: scale(0.7); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-bounce {
            animation: bounce 0.6s ease infinite alternate;
          }
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }
        `}
        </style>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
