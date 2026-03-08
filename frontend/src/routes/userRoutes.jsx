import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "@/pages/User/UserLayout";
import Home from "@/pages/User/Home";
import Login from "@/components/Login";
import Register from "@/pages/User/Register";
import Profile from "@/pages/User/Profile";
import Logout from "@/components/Logout";
import Landing from "../utils/Landing";
import AboutUs from "@/components/AboutUs";
import UserProtectedWrapper from "@/pages/User/UserProtectedWrapper";
import Cart from "@/pages/User/Cart";
import ProductsPage from "../pages/Product/ProductsPage";
import ProductDetail from "../pages/Product/ProductDetail";
import EditProfile from "../pages/User/EditProfile";
import ForgotPassword from "../pages/User/ForgotPassword";
import BackgroundVideo from "@/components/BackgroundVideo";
import { CartProvider } from "@/context/CartContext";
import CartPage from "@/pages/User/Cart";
import Success from "@/components/Success";
import Order from "@/pages/User/Payment";
import OrderHistory from "@/pages/User/OrderHistory";
import HelpCenter from "@/components/HelpCenter";
import Payment from "@/pages/User/Payment";

const UserRoutes = () => {
  return (
    <>
      {/* <BackgroundVideo /> */}
      <Routes>
        {/* Splash */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={
            <>
              <Home />
            </>
          }
        />

        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="register" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="register" element={<Register />} />
          <Route path="edit" element={<EditProfile />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route
            path="logout"
            element={
              <UserProtectedWrapper>
                <Logout />
              </UserProtectedWrapper>
            }
          />
        </Route>

        {/* About Us */}
        <Route path="/about-us" element={<AboutUs />} />

        {/* Products */}
        <Route
          path="/products"
          element={
            <ProductsPage />
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductDetail />
          }
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <UserProtectedWrapper>
              <CartPage />
            </UserProtectedWrapper>
          }
        />

        {/* Order */}
        <Route
          path="/payment"
          element={
            <UserProtectedWrapper>
              <Payment />
            </UserProtectedWrapper>
          }
        />

        {/* Order History */}
        <Route
          path="/orders/history"
          element={
            <UserProtectedWrapper>
              <OrderHistory />
            </UserProtectedWrapper>
          }
        />

        {/* help center */}
        <Route
          path="/help"
          element={
            <UserProtectedWrapper>
              <HelpCenter />
            </UserProtectedWrapper>
          }
        />
      </Routes>
    </>
  );
};

export default UserRoutes;
