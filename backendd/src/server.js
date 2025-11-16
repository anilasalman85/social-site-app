import express from "express";
import { startPostScheduler } from "./utils/scheduler.js";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
//import { startPostScheduler } from "./jobs/scheduler.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  }));                 // CORS configuration
app.use(express.json());
app.use(morgan("dev"));
app.use(mongoSanitize());        // Sanitize inputs

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 requests per window per IP
  message: "Too many auth requests from this IP, try again later.",
});
app.use("/api/auth", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 5000;
startPostScheduler();
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
