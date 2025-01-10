import { Router } from "express";
import sectionRoutes from "./admin/section.routes.js";
import templateRoutes from "./admin/template.routes.js";

const router = Router;

router.use("/section" ,sectionRoutes );
router.use("/template" ,templateRoutes );

export default router;