"use client";

import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { LayoutDashboard, Users, Package, ShoppingBag, CreditCard, MessageSquare, LogOut, Menu } from "lucide-react";

const navLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
  { name: "Users", path: "/admin/users", icon: <Users size={18} strokeWidth={1.5} /> },
  { name: "Products", path: "/admin/products", icon: <Package size={18} strokeWidth={1.5} /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={18} strokeWidth={1.5} /> },
  { name: "Payments", path: "/admin/payments", icon: <CreditCard size={18} strokeWidth={1.5} /> },
  { name: "Feedbacks", path: "/admin/feedbacks", icon: <MessageSquare size={18} strokeWidth={1.5} /> },
];

export default function AdminLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarContent = (
    <div className="h-full flex flex-col bg-[#050505] text-white border-r border-white/5">
      {/* Brand Section */}
      <div className="p-8 mb-4">
        <h2 className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#A37E2C] mb-1">Administrative</h2>
        <h1 className="text-2xl font-serif italic">The Manor</h1>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => isMobile && setDrawerOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 text-[11px] tracking-widest uppercase font-medium transition-all duration-500 group ${
                  isActive 
                    ? "text-[#A37E2C] bg-[#A37E2C]/5 border-r-2 border-[#A37E2C]" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={`${isActive ? "text-[#A37E2C]" : "group-hover:text-[#A37E2C]"} transition-colors`}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="p-6 space-y-4">

        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            window.location.href = "/admin/login";
          }}
          className="w-full flex items-center justify-center gap-3 py-4 text-[10px] tracking-[0.3em] uppercase font-bold border border-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500"
        >
          <LogOut size={14} /> Terminate Session
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-72 h-full flex-shrink-0">
          {SidebarContent}
        </aside>
      )}

      {/* Mobile Trigger & Drawer */}
      {isMobile && (
        <>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="fixed top-6 left-6 z-50 p-3 bg-[#A37E2C] text-black hover:bg-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="left">
            <DrawerContent className="h-full w-72 bg-black border-none rounded-none">
              {SidebarContent}
            </DrawerContent>
          </Drawer>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative">
        {/* Subtle inner glow for main content */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A37E2C]/20 to-transparent" />
        <div className="h-full overflow-y-auto p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}