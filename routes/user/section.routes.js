import { Router } from "express";
import { createSection, deleteSection, getAllSections, getSectionById, updateSection } from "../../controllers/admin/sections.controller.js";

const router = Router();

router.post("/",createSection);
router.get("/",getAllSections);
router.get("/:id",getSectionById);
router.put("/:id",updateSection);
router.delete("/",deleteSection);

export default router;