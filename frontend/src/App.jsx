import "./index.css";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom"
import PageTransition from "./animation/PageTransition";
import UserLayout from "@/pages/User/UserLayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Landing from "./utils/Landing";
import EmailLogin from "./components/EmailLogin";
import AboutUs from "./components/AboutUs";
import PorductLayout from "./pages/Product/PorductLayout";
import OTPVerification from "./components/OtpVerifivation";

const App = () => {
  return (
    <Routes>
      {/*Splash Screen for 3 seconds*/}
      <Route path="/" element={<Landing />} />

      {/* Default route is Home */}
      <Route path="/home" element={<Home />} />


      {/* User Routes*/}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="register" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="email-register" element={<EmailLogin />} />
        <Route path="email-register/otp-send" element={<OTPVerification />} />
        <Route path="logout" element={<Logout />} />
      </Route>

      {/* About Us our company */}
      <Route path="/about-us" element={<AboutUs />} />

      {/*Product Routes*/}
      <Route path="/product" element={<PorductLayout />}></Route>
    </Routes>
  );
};

export default App;
