// src/context/UserContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export const UserDataContext = createContext();

export const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user when app loads (if JWT exists in cookies/localstorage)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users/profile`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        toast.error("You are not logged in", error.response?.data || error.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};
