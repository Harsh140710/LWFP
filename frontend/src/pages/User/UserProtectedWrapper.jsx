import { UserDataContext } from "@/context/UserContext";
import React, { useEffect } from "react";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const UserProtectedWrapper = ({ children }) => {
  const { user } = useContext(UserDataContext);

  if (!user) {
    // redirect to login if not logged in
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default UserProtectedWrapper
