import { Router } from "express";
import { createTemplate, deleteTemplate, getAllTemplates, getTemplateById, updateTemplate } from "../../controllers/template.controller.js";

const router = Router();

router.post("/",createTemplate);
router.get("/",getAllTemplates);
router.get("/:id",getTemplateById);
router.put("/:id",updateTemplate);
router.delete("/",deleteTemplate);

export default router;