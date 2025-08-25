import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate()
  useEffect(() => {
    if (!token) {
      navigate("/user/login");
    }
  }, [token]);

  return <>{children}</>;
};

export default UserProtectedWrapper;
