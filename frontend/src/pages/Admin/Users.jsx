import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import api from "@/utils/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // No need to read token from localStorage, cookies are used automatically
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users`, {withCredentials: true});
        setUsers(res.data.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch users");
        console.error(err.response?.data || err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/users/${id}`, {withCredentials: true});
      setUsers(users.filter((user) => user._id !== id));
      toast.success(`Deleted ${name}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      `${user.fullname?.firstname || ""} ${user.fullname?.lastname || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-black h-screen">
        <CardHeader>
          <h2 className="text-xl font-bold">Manage Users</h2>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />

          <ScrollArea className="h-[60vh]">
            {filteredUsers.length === 0 ? (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                No users found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  {" "}
                  {/* ensure table is wider than mobile */}
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone No.</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="overflow-x-scroll">
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user._id}</TableCell>
                        <TableCell>{`${user.fullname?.firstname || ""} ${
                          user.fullname?.lastname || ""
                        }`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>{user.role || "user"}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                user._id,
                                `${user.fullname?.firstname || ""}`
                              )
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
