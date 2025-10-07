"use client";

import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const navigate = useNavigate();

  const handleBuyNow = (item) => {
    navigate("/orders", {
      state: { products: [{ ...item, quantity: item.quantity || 1 }] },
    });
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Your Cart</h1>

        {cart.length > 0 ? (
          <div className="flex items-center gap-3 flex-wrap">
            {/* Continue Shopping first */}
            <Link to="/products">
              <Button variant="outline" className="whitespace-nowrap">
                Continue Shopping
              </Button>
            </Link>

            <Button
              variant="destructive"
              onClick={clearCart}
              className="whitespace-nowrap"
            >
              Clear Cart
            </Button>
          </div>
        ) : null}
      </div>

      {cart.length === 0 ? (
        <div className="text-center mt-20 dark:text-gray-300">
          <p className="text-lg">Your cart is empty.</p>
          <Link to="/products" className="text-blue-500 underline text-sm">
            Shop now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDE — Cart Items */}
          <div className="flex-1">
            {/* 2 columns even on mobile */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div
                    onClick={() => navigate(`/products/${item._id}`)}
                    className="cursor-pointer flex justify-center"
                  >
                    <img
                      src={item.images?.[0]?.url || "/placeholder.jpg"}
                      alt={item.title}
                      className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-lg"
                    />
                  </div>

                  {/* Title & brand */}
                  <div className="mt-3">
                    <h2
                      onClick={() => navigate(`/products/${item._id}`)}
                      className="font-semibold text-sm sm:text-base dark:text-white cursor-pointer line-clamp-2"
                    >
                      {item.title}
                    </h2>
                    {item.brand && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.brand}
                      </p>
                    )}
                  </div>

                  <div className="text-sm sm:text-base font-semibold mt-3 dark:text-white whitespace-nowrap">
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                  {/* Quantity and Price on same line */}
                  <div className="mt-3 flex items-center justify-between flex-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs dark:text-gray-300">Qty:</span>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, Number(e.target.value))
                        }
                        className="w-14 text-center"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleBuyNow(item)}
                    >
                      Buy Now
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE — Order Summary */}
          <aside className="lg:w-1/3 rounded-2xl p-6 border dark:border-gray-800 bg-white dark:bg-black shadow-md dark:shadow-none h-fit lg:sticky lg:top-28">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2 dark:text-gray-300">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2 dark:text-gray-300">
              <span>Shipping</span>
              <span>₹40</span>
            </div>

            <hr className="my-3 border-gray-200 dark:border-gray-700" />

            <div className="flex justify-between font-semibold text-lg dark:text-white">
              <span>Total</span>
              <span>₹{(totalPrice + 40).toFixed(2)}</span>
            </div>

            <div className="mt-5">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate("/order", { state: { cart } })}
              >
                Proceed to Checkout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
