"use client";

import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { Separator } from "@/components/ui/separator";
import { Ghost } from "lucide-react";

const navLinks = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Users", path: "/admin/users" },
  { name: "Products", path: "/admin/products" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Analytics", path: "/admin/analytics" },
];

export default function AdminLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar content
  const SidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="p-6 text-xl font-bold border-b border-gray-200 dark:border-gray-700">
        Admin Panel
      </div>
      <ScrollArea className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="block px-4 py-2 rounded hover:bg-green-500 dark:hover:bg-green-700 hover:text-white transition"
          >
            {link.name}
          </Link>
        ))}
      </ScrollArea>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-4">
        <div className="flex items-center justify-between px-5 py-2 border dark:border-gray-700 rounded-3xl">
          <span className="text-gray-800 dark:text-white font-semibold">Theme Toggle</span>
          <ThemeToggleButton /> {/* now no nested button */}
        </div>

        <Button
          variant="destructive"
          onClick={() => {
            localStorage.removeItem("accessToken");
            window.location.href = "/admin/login";
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <aside className="fixed w-64 h-full">{SidebarContent}</aside>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button className="fixed top-4 left-4 z-50">☰</Button>
          </DrawerTrigger>
          <DrawerOverlay />
          <DrawerContent className="w-64">{SidebarContent}</DrawerContent>
        </Drawer>
      )}

      {/* Main Content */}
      <main className={`flex-1 border ${!isMobile ? "ml-64" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
