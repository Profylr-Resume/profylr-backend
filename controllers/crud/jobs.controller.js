import { internalServerError, missingFieldsError, notFoundError } from "../../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../../utils/success.utils.js";
import { createJobHandler, deleteAllJobsHandler, deleteJobHandler, getJobHandler, updateJobHandler } from "../../handlers/jobs.handler.js";

// Job Creation

export const createJobController = async (req, res) => {

	const userId = req.user?._id;

	if (!userId) {
		return res.status(400).json({
			message: "user not present.",
			status: "error"
		});
	}
	try {

		const { success, error, data } = await createJobHandler(req.body,userId);

		if (!success) {
			return res.status(400).json({
				message: "Validation error or missing fields.",
				errors: error,
				status: "error"
			});
		}

		return eventExecutedSuccessfully(res, data, "Job and associated events added successfully.");
	} catch (error) {
		console.error("Error creating job:", error);
		return internalServerError(res, error.message);
	}
};

// Update Job

// id-->jobid
export const updateJobController = async (req, res) => {
	try {
		const { success, error, data } = await updateJobHandler(req);

		if (!success) {
			return res.status(400).json({ message: error, status: "error" });
		}

		return eventExecutedSuccessfully(res, data, "Job updated and history recorded successfully");
	} catch (error) {
		console.error("Error in updateJobController:", error);
		return internalServerError(res, error.message);
	}
};
  

/**
 * Get jobs
 * 
 * the jobs are being filtered on below paramters
 * id-->jobid,
 * companyName,
 * role (designation),
 * status,
 * appliedOnDate,
 * followUp
 * http://localhost:3000/api/jobs/?id=64b7fda56a6b3c00123abcd&companyName=TechCorp&role=Developer&status=open&appliedOnDate=2024-12-18&followUp=true
 * 
 *  * http://localhost:3000/api/jobs/?id=64b7fda56a6b3c00123abcd&
 * companyName=TechCorp&
 * role=Developer&
 * status=interviwed&
 * appliedOnDate=2024-12-18&
 * followUp=true


*/


export const getJobsController = async (req, res) => {
	try {
		const { success, data, error } = await getJobHandler(req);

		if (!success) {
			return res.status(400).json({ success: false, message: error });
		}

		return res.status(200).json({ success: true, data });
	} catch (error) {
		return internalServerError(res, error.message);
	}
};


// Get Job by job id


// Delete All Jobs for a User
export const deleteAllJobsController = async (req, res) => {
	try {
		const { success, error, data } = await deleteAllJobsHandler(req);

		if (!success) {
			return res.status(400).json({ success: false, message: error });
		}

		return res.status(200).json({ success: true, message: "Deleted all jobs successfully" });
	} catch (error) {
		return internalServerError(res, error.message);
	}
};


// Delete Job by job ID
export const deleteJobController = async (req, res) => {
	try {
		const { success, error, data } = await deleteJobHandler(req);

		if (!success) {
			return res.status(400).json({ success: false, message: error });
		}

		return res.status(200).json({ success: true, message: "Deleted job successfully" });
	} catch (error) {
		return internalServerError(res, error.message);
	}
};

