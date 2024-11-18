import { Router } from "express";
import { getPersonalizedTemplateStructure } from "../../controllers/misc.controller.js";

const router = Router();

router.post("/",getPersonalizedTemplateStructure);

export default router;