import { Router } from "express";
import personaRoutes from "./user/persona.routes.js";
import sectionRoutes from "./user/section.routes.js";
import templateRoutes from "./user/template.routes.js";
import miscRoutes from "./user/misc.routes.js";

const router = Router();

router.use("/persona",personaRoutes);
router.use("/section",sectionRoutes);
router.use("/template",templateRoutes);
router.use("/misc",miscRoutes );

export default router;