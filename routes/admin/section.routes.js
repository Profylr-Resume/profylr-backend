import { Router } from "express";
import { createSection, deleteSection, getSections, updateSection } from "../../controllers/admin/sections.controller.js";

const router = Router;

router.post("/", createSection);
router.get("/:id", getSections);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

export default router;