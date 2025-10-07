import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("🎉 Order placed successfully!");
    const timer = setTimeout(() => navigate("/"), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p className="text-lg">Your payment was successful. Redirecting...</p>
    </div>
  );
}
