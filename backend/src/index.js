import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { Server } from "socket.io";
import http from "http";
import "./cronJobs.js";

dotenv.config({ path: "./.env" });


// Create HTTP server
const server = http.createServer(app);

// Setup socket.io for real-time updates
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://timeless-elegancee-frontend.onrender.com"
    ],
    credentials: true
  }
});


app.use((req, res, next) => {
  console.log("🔍 Incoming origin:", req.headers.origin);
  console.log("✅ Allowed origin:", process.env.CORS_ORIGIN);
  next();
});



// Attach io instance to app (so controllers can access via req.app.get("io"))
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8001;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection ERROR:", err);
  });
