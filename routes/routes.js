import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use("/user",authMiddleware , userRoutes );
// router.use("/user" , userRoutes );
router.use("/auth" , authRoutes);

export default router;