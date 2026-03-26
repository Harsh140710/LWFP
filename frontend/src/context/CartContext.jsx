"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart:", error);
      }
    }
    setIsHydrated(true); // Flag that we have finished loading from storage
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      // Use _id or id depending on your API structure
      const productId = product._id || product.id; 
      const existing = prev.find((item) => (item._id || item.id) === productId);

      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== productId));

  const updateQuantity = (productId, quantity) =>
    setCart((prev) =>
      prev.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      )
    );

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const totalPrice = cart.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        isHydrated, // Useful for showing a loading spinner on the Cart page
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};