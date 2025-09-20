import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/pages/Admin/AdminLayout";
import AdminLogin from "@/pages/Admin/AdminLogin";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import Users from "@/pages/Admin/Users";
import Products from "@/pages/Admin/Products";
import Orders from "@/pages/Admin/Orders";
import Analytics from "@/pages/Admin/Analytics";
import AdminProtectedWrapper from "@/pages/Admin/AdminProtectedWrapper";

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
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
