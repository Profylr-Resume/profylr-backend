import { Router } from "express";
import { loginUserController, registerUserController } from "../controllers/auth.controller.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";

const router=Router();

router.post("/register", registerUserController );
router.post("/login", loginUserController );
// router.get("/verifyJwt",authMiddleware,verifyUserWithJWT );


export default router;