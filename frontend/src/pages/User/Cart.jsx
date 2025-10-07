"use client";

import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Your Cart</h1>
        {cart.length > 0 && (
          <Button
            variant="destructive"
            onClick={clearCart}
            className="mt-4 sm:mt-0"
          >
            Clear Cart
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">
          Your cart is empty.{" "}
          <Link to="/products" className="text-blue-500 underline">
            Shop now
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Table Header */}
            <div className="hidden lg:flex justify-between font-semibold border-b pb-2 dark:text-white">
              <span className="w-1/3">Product</span>
              <span className="w-1/6 text-center">Price</span>
              <span className="w-1/6 text-center">Quantity</span>
              <span className="w-1/6 text-center">Total</span>
              <span className="w-1/6"></span>
            </div>

            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col lg:flex-row items-center border rounded-lg p-4 gap-4 dark:bg-gray-800"
              >
                {/* Product Info */}
                <div className="flex items-center w-full lg:w-1/3 gap-4">
                  <img
                    src={item.images?.[0]?.url || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold dark:text-white">{item.title}</h2>
                    {item.brand && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.brand}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="hidden lg:block w-1/6 text-center dark:text-white">
                  ₹{item.price.toFixed(2)}
                </div>

                {/* Quantity */}
                <div className="w-full lg:w-1/6 flex justify-center">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, Number(e.target.value))
                    }
                    className="w-20"
                  />
                </div>

                {/* Total */}
                <div className="hidden lg:block w-1/6 text-center dark:text-white">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Button */}
                <div className="w-full lg:w-1/6 flex justify-center">
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="p-6 border rounded-lg dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
            <div className="flex justify-between mb-2 dark:text-white">
              <span>Total:</span>
              <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full mb-2" onClick={() => alert("Proceed to checkout")}>
              Checkout
            </Button>
            <Link to="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
