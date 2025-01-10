import { Router } from "express";
import { createPersona } from "../../controllers/persona.controller.js";

const router = Router();

router.post("/",createPersona);


export default router;