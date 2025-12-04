// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Load environment variables
dotenv.config();
console.log("Loaded MONGO_URI =", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors());

// Default route
app.get("/", (req, res) => {
  res.send("API is running");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/tasks", taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
