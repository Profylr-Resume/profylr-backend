import { Router } from "express";
import { createTemplate, deleteTemplate, getTemplates, updateTemplate } from "../../controllers/admin/template.controller.js";

const router = Router;

router.post("/", createTemplate);
router.get("/:id" , getTemplates);
router.put("/:id", updateTemplate);
router.delete("/:id" , deleteTemplate);

export default router;