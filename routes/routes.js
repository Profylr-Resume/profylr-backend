import { Router } from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";

const router = Router();

router.use("/user", userRoutes );
router.use("/auth" , authRoutes);

export default router;