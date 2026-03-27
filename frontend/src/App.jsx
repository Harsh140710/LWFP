import "./index.css";
import { Toaster } from "sonner";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        visibleToasts={5}
        expand={true}
        progressBar={true}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#080808",
            color: "#ffffff",
            border: "1px solid rgba(163, 126, 44, 0.3)",
            borderRadius: "10px",
            padding: "30px 24px",
            minWidth: "350px",
            fontSize: "13px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "serif",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            className: "luxury-toast"
          },
        }}
        pauseWhenPageIsHidden
      />

      {isAdminRoute ? adminRoutes() : userRoutes()}
    </>
  );
};

export default App;