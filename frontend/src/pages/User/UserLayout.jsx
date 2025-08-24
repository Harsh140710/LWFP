import ScrollLine from "@/animation/ScrollLine";
import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      {/* Render whatever child route is active */}
      <div>
        <Outlet />
        <ScrollLine />
      </div>
    </div>
  );
};

export default UserLayout;
