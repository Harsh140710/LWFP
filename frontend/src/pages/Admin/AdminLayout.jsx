"use client";

import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerOverlay, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const navLinks = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Users", path: "/admin/users" },
  { name: "Products", path: "/admin/products" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Analytics", path: "/admin/analytics" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDrawerOpen(!mobile); // default open on desktop/tablet, closed on mobile
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Admin logged out successfully");
    navigate("/admin/login");
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <div className="flex h-screen">
      {/* Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {isMobile && <DrawerOverlay />}

        <DrawerContent className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="font-bold text-lg">Admin Panel</span>
            {isMobile && (
              <Button size="sm" variant="ghost" onClick={() => setDrawerOpen(false)}>
                ×
              </Button>
            )}
          </div>

          <ScrollArea className="flex-1 p-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block rounded-md px-4 py-2 hover:bg-green-500 hover:text-white transition"
              >
                {link.name}
              </Link>
            ))}
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dark Mode</span>
              <Switch checked={darkMode} onCheckedChange={toggleTheme} />
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </DrawerContent>

        {/* Mobile toggle button */}
        {isMobile && !drawerOpen && (
          <DrawerTrigger asChild>
            <Button className="m-2 fixed z-50">☰</Button>
          </DrawerTrigger>
        )}
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
