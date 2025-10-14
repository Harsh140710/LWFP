import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { Server } from "socket.io";
import cors from 'cors'
import http from "http";
import "./cronJobs.js";

dotenv.config({ path: "./.env" });

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
)
// Create HTTP server
const server = http.createServer(app);

// Setup socket.io for real-time updates
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
  },
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
