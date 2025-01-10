import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/user" , userRoutes );
router.use("/admin" , adminRoutes );
router.use("/auth" , authRoutes );

export default router;