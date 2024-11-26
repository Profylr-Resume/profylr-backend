import { Router } from "express";
import { createPersona, deletePersona } from "../../controllers/crud/persona.controller.js";

const router = Router();

router.post("/",createPersona);
router.delete("/:id",deletePersona);

export default router;