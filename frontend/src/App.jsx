import "./index.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./utils/Landing";
import Home from "@/pages/User/Home";
import BackgroundVideo from "@/components/BackgroundVideo";
import AboutUs from "@/components/AboutUs";
import ProductsPage from "./pages/Product/ProductsPage";
import ProductDetail from "./pages/Product/ProductDetail";
import Cart from "@/components/Cart";
import { Toaster } from "sonner";

// Import separated routes
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

const App = () => {
  return (
    <>
      <Toaster position="top-center" richColors />

      {/* <Routes> */}

        {/* User Routes */}
        {userRoutes()}

        {/* Admin Routes */}
        {adminRoutes()}
      {/* </Routes> */}
    </>
  );
};

export default App;
