import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "@/pages/User/UserLayout";
import Home from "@/components/Home";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Logout from "@/components/Logout";
import Landing from "./utils/Landing";
import EmailLogin from "@/components/EmailLogin";
import AboutUs from "@/components/AboutUs";
import ProductLayout from "@/pages/Product/ProductLayout";
import OTPVerification from "@/components/OtpVerifivation";
import UserProtectedWrapper from "@/pages/User/UserProtectedWrapper";
import Cart from "@/components/Cart";
import Profile from "@/components/Profile";
import Products from "@/components/Products";
import EditProfile from "./pages/User/EditProfile";

const App = () => {
  return (
    <Routes>
      {/* Splash Screen for 3 seconds */}
      <Route path="/" element={<Landing />} />

      {/* Default route is Home */}
      <Route path="/home" element={<Home />} />

      {/* User Routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="register" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<Register />} />
        <Route path="email-register" element={<EmailLogin />} />
        <Route path="email-register/otp-send" element={<OTPVerification />} />
        <Route path="edit" element={<EditProfile   />} />
        <Route
          path="logout"
          element={
            <UserProtectedWrapper>
              <Logout />
            </UserProtectedWrapper>
          }
        />
      </Route>

      {/* About Us */}
      <Route path="/about-us" element={<AboutUs />} />

      {/* Product Routes */}
      <Route
        path="/product"
        element={
          <UserProtectedWrapper>
            <ProductLayout />
          </UserProtectedWrapper>
        }
      >
        {/* use index here instead of path="/" */}
        <Route index element={<Products />} />
      </Route>

      {/* User Cart */}
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default App;
