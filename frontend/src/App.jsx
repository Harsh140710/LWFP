import "./index.css"
import { Routes, Route } from "react-router-dom"
import UserLayout from '@/pages/User/UserLayout'
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Logout from "./components/Logout"
import Landing from "./utils/Landing"

const App = () => {
  return (
    
    <Routes>
      //Splash Screen for 3 seconds
      <Route path="/" element={<Landing />} />

      //Default route is Home
      <Route path="/home" element={<Home />} />

      //user routes
      <Route path="/user" element={<UserLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="logout" element={<Logout />} />
      </Route>

    </Routes>
  )
}

export default App
