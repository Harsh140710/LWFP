"use client";

import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
  } = useCart();

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/products" className="text-blue-500 underline">Shop now</Link>.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.images?.[0]?.url || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex flex-col flex-1">
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                    <p className="text-green-600 font-bold">₹{item.price}</p>
                    <div className="flex gap-2 mt-2 items-center">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, Number(e.target.value))
                        }
                        className="w-16"
                      />
                      <Button
                        variant="destructive"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <p className="flex justify-between mb-2">
                <span>Total:</span>
                <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
              </p>
              <Button className="w-full" onClick={() => alert("Proceed to checkout")}>
                Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
