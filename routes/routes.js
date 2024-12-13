import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import jobRoutes from "./job.routes.js";
import eventRoutes from "./calendarEvents.routes.js";

const router = Router();

router.use("/user",authMiddleware , userRoutes );
// router.use("/user" , userRoutes );
router.use("/auth" , authRoutes);

router.use("/jobs",authMiddleware,jobRoutes);

router.use("/events",authMiddleware,eventRoutes);

export default router;