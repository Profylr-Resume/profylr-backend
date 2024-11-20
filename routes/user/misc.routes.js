import { Router } from "express";
import { getPersonalizedTemplates } from "../../controllers/misc.controller.js";

const router = Router();

router.post("/personalized-templates" , getPersonalizedTemplates );

export default router;