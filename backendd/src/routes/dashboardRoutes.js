import express from "express";
import { getStats, getUpcoming } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getStats);
router.get("/upcoming", protect, getUpcoming);

export default router;
