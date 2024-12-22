import { Router } from "express";
import { createJobController, deleteAllJobsController, deleteJobController, getJobsController, updateJobController } from "../controllers/crud/jobs.controller.js";

const router = Router();

// Create a job
router.post("/", createJobController);

// Update a job
router.put("/:id", updateJobController);

// Get all jobs for a user

// Get a specific job
router.get("/", getJobsController);

// Delete all jobs for a user
router.delete("/user/", deleteAllJobsController);

// Delete a specific job
router.delete("/:id", deleteJobController);

export default router;
