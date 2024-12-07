import { Router } from "express";
import { createJobController, deleteAllJobsController, deleteJobController, getAllJobsController, getJobController, updateJobController } from "../../controllers/crud/jobs.controller.js";

const router = Router();

// Create a job
router.post("/", createJobController);

// Update a job
router.put("/:id", updateJobController);

// Get all jobs for a user
router.get("/user/:id/jobs", getAllJobsController);

// Get a specific job
router.get("/:id", getJobController);

// Delete all jobs for a user
router.delete("/user/:id", deleteAllJobsController);

// Delete a specific job
router.delete("/:id", deleteJobController);

export default router;
