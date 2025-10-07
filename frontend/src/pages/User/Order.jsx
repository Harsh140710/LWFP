// src/pages/User/Order.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { formatPrice } from "@/utils/format";
import { toast } from "sonner";

const Order = () => {
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
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Helper: parse JWT to get user info
  const getUserFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You must login to place an order");
      navigate("/user/login");
      return;
    }

    const user = getUserFromToken(token);
    if (user) {
      setUserDetails((prev) => ({
        ...prev,
        firstname: user.fullname?.firstname || "",
        lastname: user.fullname?.lastname || "",
        email: user.email || "",
      }));
    }

    if (products.length === 0) {
      toast.error(
        "No products selected. Please add items to your cart or click Buy Now."
      );
    }
  }, [navigate, products.length]);

  const handleChange = (e) =>
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });

  const updateQuantity = (index, qty) => {
    const next = products.map((p, i) =>
      i === index ? { ...p, quantity: Math.max(1, qty) } : p
    );
    setProducts(next);
  };

  const subtotal = products.reduce(
    (s, p) => s + (Number(p.price) || 0) * (p.quantity || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required user details
    if (
      !userDetails.firstname ||
      !userDetails.lastname ||
      !userDetails.address ||
      !userDetails.phone
    ) {
      toast.error("Please fill all required details.");
      return;
    }

    if (products.length === 0) {
      toast.error("No products in order.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You must login to place an order");
        navigate("/user/login");
        return;
      }

      // Prices
      const shippingPrice = 40;
      const taxPrice = 0;
      const totalPrice = subtotal + shippingPrice + taxPrice;

      const orderItems = products
        .filter((p) => p._id || p.productId)
        .map((p) => ({
          product: p._id || p.productId, // <-- backend uses this
          name: p.title || p.name || "Product",
          quantity: Number(p.quantity) || 1,
          price: Number(p.price) || 0,
          image: p.images?.[0]?.url || "/placeholder.jpg",
        }));

      if (orderItems.length === 0) {
        toast.error("No valid products to place order.");
        setLoading(false);
        return;
      }

      console.log("Order Items:", orderItems);

      const payload = {
        customer: {
          address: userDetails.address,
          city: userDetails.city || "",
          pincode: userDetails.pincode || "",
        },
        orderItems, // <-- single correct key
        paymentMethod,
        shippingPrice,
        taxPrice,
        totalPrice,
      };
      console.log("Final Payload:", payload);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/orders/addOrderItems`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (paymentMethod === "card") {
        if (data?.url) {
          window.location.href = data.url; // redirect to payment
        } else {
          toast.error("Payment initialization failed.");
        }
      } else {
        if (data?.data || data?.success) {
          toast.success("Order placed successfully!");
          navigate("/success");
        } else {
          toast.error("Failed to place order.");
        }
      }
    } catch (err) {
      console.error("Order submission error:", err.response || err);
      const msg = err.response?.data?.message || "Something went wrong.";
      console.error("Order submission error:", err.response?.data);

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
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
                  className="p-3 border rounded"
                />
                <input
                  required
                  name="lastname"
                  placeholder="Last name"
                  value={userDetails.lastname}
                  onChange={handleChange}
                  className="p-3 border rounded"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={userDetails.email}
                  onChange={handleChange}
                  className="p-3 border rounded"
                />
                <input
                  required
                  name="phone"
                  placeholder="Phone"
                  value={userDetails.phone}
                  onChange={handleChange}
                  className="p-3 border rounded"
                />
                <input
                  name="city"
                  placeholder="City"
                  value={userDetails.city}
                  onChange={handleChange}
                  className="p-3 border rounded"
                />
                <input
                  name="pincode"
                  placeholder="Pincode"
                  value={userDetails.pincode}
                  onChange={handleChange}
                  className="p-3 border rounded"
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
                <label className="font-medium text-gray-700 dark:text-gray-200">
                  Payment method
                </label>
                <div className="flex gap-6 mt-2">
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

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <aside className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Order summary
            </h3>
            <div className="mt-3 space-y-3">
              {products.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No items in order.{" "}
                  <Link to="/products" className="text-indigo-600">
                    Browse products
                  </Link>
                </div>
              ) : (
                products.map((p, idx) => (
                  <div key={p._id || idx} className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.url || "/placeholder.jpg"}
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
                            updateQuantity(idx, (p.quantity || 1) - 1)
                          }
                          className="p-1 border rounded"
                        >
                          -
                        </button>
                        <div className="px-2">{p.quantity || 1}</div>
                        <button
                          onClick={() =>
                            updateQuantity(idx, (p.quantity || 1) + 1)
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
                ))
              )}
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
      </div>
    </div>
  );
};

export default Order;
