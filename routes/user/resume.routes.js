import { Router } from "express";
import { createResume , allResume, deleteResume, oneResume, updateResume } from "../../controllers/resume.controller.js";

const router = Router();

router.post("/", createResume );
router.put("/",updateResume);
router.delete("/:id",deleteResume);
router.get("/",allResume);
router.get("/:id",oneResume);

export default router;