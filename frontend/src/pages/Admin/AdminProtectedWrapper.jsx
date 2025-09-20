import React, { useEffect, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserDataContext } from "@/context/UserContext";
import { toast } from "sonner";

const AdminProtectedWrapper = ({ children }) => {
  const { user } = useContext(UserDataContext);
  const location = useLocation();

  useEffect(() => {
    // Optional: check token expiration or role validation here
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admins only.");
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    // Redirect to admin login if not logged in or not admin
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedWrapper;
