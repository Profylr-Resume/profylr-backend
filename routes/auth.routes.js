import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { registerUser,loginUser, verifyUserWithJWT } from "../controllers/auth.controller.js";

const router=Router();

router.post("/register",registerUser );
router.post("/login",loginUser );
router.get("/verifyJwt",authMiddleware,verifyUserWithJWT );


export default router;