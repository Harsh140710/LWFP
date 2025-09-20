"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Sun, Moon } from "lucide-react";

const dummySalesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4000 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 7000 },
];

const dummyUsersData = [
  { day: "Mon", users: 120 },
  { day: "Tue", users: 200 },
  { day: "Wed", users: 150 },
  { day: "Thu", users: 300 },
  { day: "Fri", users: 250 },
  { day: "Sat", users: 400 },
  { day: "Sun", users: 350 },
];

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-[#0B0B0D] text-gray-900 dark:text-white p-6 transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun /> : <Moon />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$45,000</p>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">1,250</p>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Orders Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">320</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Chart */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummySalesData}>
                    <XAxis dataKey="month" stroke={darkMode ? "#fff" : "#111"} />
                    <YAxis stroke={darkMode ? "#fff" : "#111"} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#4ade80" fill="#86efac" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Chart */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Active Users</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dummyUsersData}>
                    <XAxis dataKey="day" stroke={darkMode ? "#fff" : "#111"} />
                    <YAxis stroke={darkMode ? "#fff" : "#111"} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
