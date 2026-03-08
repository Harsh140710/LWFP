import "./index.css";
import { Toaster } from "sonner";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

const App = () => {
  return (
    <>
      {/* Professional Luxury Toaster Configuration */}
      <Toaster
        position="top-right"
        theme="dark"
        visibleToasts={5} // Allows more toasts to stack
        expand={true} // Shows the stack clearly
        progressBar={true}
        toastOptions={{
          duration: 4000, // 5 seconds gives the user time to read
          style: {
            background: "#080808",
            color: "#ffffff",
            border: "1px solid rgba(163, 126, 44, 0.3)",
            borderRadius: "10px",
            padding: "30px 24px", // Increased padding makes it look bigger
            minWidth: "350px",    // Ensures the toast has a substantial width
            fontSize: "13px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "serif",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            className: "luxury-toast"
          },
        }}
        // This enables the progress bar at the bottom
        pauseWhenPageIsHidden
      />

      {userRoutes()}
      {adminRoutes()}
    </>
  );
};

export default App;