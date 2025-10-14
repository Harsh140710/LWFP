import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/pages/Admin/AdminLayout";
import AdminLogin from "@/pages/Admin/AdminLogin";
import AdminDashBoard from "@/pages/Admin/AdminDashBoard";
import Users from "@/pages/Admin/Users";
import Products from "@/pages/Admin/Products";
import Orders from "@/pages/Admin/Orders";
import AdminProtectedWrapper from "@/pages/Admin/AdminProtectedWrapper";
import Payment from "@/pages/Admin/Payment"
import Feedback from "@/pages/Admin/Feedback"

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedWrapper>
            <AdminLayout />
          </AdminProtectedWrapper>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashBoard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="payments" element={<Payment />} />
        <Route path="feedbacks" element={<Feedback />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
