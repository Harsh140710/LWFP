import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { Server } from "socket.io";
import cors from 'cors'
import http from "http";
import "./cronJobs.js";

dotenv.config({ path: "./.env" });

const allowedOrigins = [
  'https://timeless-elegance-frontend.onrender.com',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS check, incoming origin:", origin);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (!origin) {
      // for tools like Postman or server-to-server requests
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
};

app.use(cors(corsOptions));

// Create HTTP server
const server = http.createServer(app);

// Setup socket.io for real-time updates
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
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
