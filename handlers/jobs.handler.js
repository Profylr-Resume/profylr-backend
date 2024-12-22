import mongoose from "mongoose";
import CALENDAR_EVENT from "../models/CalendarEventsModel.js";
import jobApplicationModel from "../models/JobApplicationModel.js";
import jobValidationSchema from "../validations/jobs.validate.js";
import jobHistoryModel from "../models/JobHistoryModel.js";

export const createJobHandler = async (data,userId) => {
	try {

		const { error, value } = jobValidationSchema.validate(data, { abortEarly: false });

		if (error) {
			return {
				success: false,
				error: error.details,
				data: null
			};
		}

		const { events, ...jobData } = value;

		const jobWithUser = { ...jobData, userId };

		// Save job
		const newJob = await jobApplicationModel.create(jobWithUser);

		// Handle events if provided
		if (events && Array.isArray(events)) {
			const eventPromises = events.map((event) =>
				CALENDAR_EVENT.create({
					userId,
					jobId: newJob._id, // Link to the created job
					date: event.date,
					note: event.note
				})
			);

			const savedEvents = await Promise.all(eventPromises);

			// Attach saved event IDs to the job
			newJob.events = savedEvents.map((event) => event._id);
			await newJob.save();
		}

		return {
			success: true,
			error: null,
			data: newJob
		};
	} catch (error) {
		console.error("Error in createJobHandler:", error);
		return {
			success: false,
			error: "Internal server error while creating job.",
			data: null
		};
	}
};


export const updateJobHandler = async (req) => {
	try {
		const { id } = req.params;
		const userId = req.user?._id;
   

		if (!id) {
			return { success: false, error: "Job ID is required", data: null };
		}

		if (!userId) {
			return { success: false, error: "User ID is required", data: null };
		}

		// Validate request body
		const { error, value } = jobValidationSchema.validate({...req.body,userId}, { abortEarly: false });
		if (error) {
			return { success: false, error: error.details, data: null };
		}

		const { events, ...jobData } = value;

		// Fetch the job by ID
		const job = await jobApplicationModel
			.findById(id)
			.populate({ path: "events", model: "calendarEvent" })
			.exec();

		if (!job) {
			return { success: false, error: "Job not found", data: null };
		}

		// Track changes for jobHistory
		const oldData = {
			userId:job.userId,
			companyName: job.companyName,
			role: job.role,
			status: job.status,
			resume: job.resume,
			appliedOnDate: job.appliedOnDate,
			jobLink: job.jobLink,
			note: job.note,
			followUp: job.followUp,
			followUpDate: job.followUpDate,
			events: job.events.map((event) => event._id) // Store event IDs
		};

		const changedFields = Object.keys(jobData).filter((key) => job[key] !== jobData[key]);

		if (changedFields.length === 0 && (!events || events.length === 0)) {
			return { success: false, error: "No changes detected", data: null };
		}

		// Create jobHistory entry
		const newHistory = new jobHistoryModel({
			userId,
			newData: { ...oldData, ...jobData },
			oldData,
			changedFields
		});

		const savedHistory = await newHistory.save();

		// Push history ID to the job's history array
		job.history.push(savedHistory._id);

		// Update job fields (excluding events)
		Object.assign(job, jobData);

		// Handle new events if provided
		if (events && Array.isArray(events)) {
			const newEventPromises = events.map((event) =>
				new CALENDAR_EVENT({
					userId,
					jobId: job._id,
					date: event.date,
					note: event.note
				}).save()
			);

			const newEventIds = (await Promise.all(newEventPromises)).map((event) => event._id);
			job.events.push(...newEventIds);
		}

		// Save the updated job
		const updatedJob = await job.save();

		return { success: true, error: null, data: updatedJob };
	} catch (error) {
		console.error("Error in updateJobHandler:", error);
		return { success: false, error: "Internal server error", data: null };
	}
};

export const getJobHandler = async (req) => {
	const { id, companyName, role, status, appliedOnDate, followUp } = req.query;
	const userId = req.user._id;

	if (!userId) {
		return { success: false, error: "User ID is required", data: null };
	}

	// Build match conditions dynamically
	const matchConditions = { userId };

	if (id) {
		if (mongoose.Types.ObjectId.isValid(id)) {
			matchConditions._id = new mongoose.Types.ObjectId(id);
		} else {
			return { success: false, error: "Invalid ID format", data: null };
		}
	}

	if (companyName) {
		matchConditions.companyName = { $regex: companyName, $options: "i" }; // Case-insensitive search
	}

	if (role) {
		matchConditions.role = { $regex: role, $options: "i" }; // Case-insensitive search
	}

	if (status) {
		matchConditions.status = { $regex: status, $options: "i" };
	}

	if (appliedOnDate) {
		matchConditions.appliedOnDate = new Date(appliedOnDate);
	}

	if (followUp) {
		matchConditions.followUp = followUp === "true"; // Convert to boolean
	}

	try {
		const jobs = await jobApplicationModel.find(matchConditions).sort({ createdAt: -1 });

		if (jobs.length === 0) {
			return { success: false, error: "No jobs found for this user", data: null };
		}

		return { success: true, error: null, data: jobs };
	} catch (err) {
		console.error("Error fetching jobs:", err);
		return { success: false, error: "Internal server error", data: null };
	}
};

export const deleteAllJobsHandler = async (req) => {
	const userId = req.user._id;

	if (!userId) {
		return { success: false, error: "User ID is required", data: null };
	}

	try {
		const result = await jobApplicationModel.deleteMany({ userId: userId });

		if (result.deletedCount === 0) {
			return { success: false, error: "No jobs found for this user", data: null };
		}

		return { success: true, error: null, data: result };
	} catch (err) {
		console.error("Error deleting jobs:", err);
		return { success: false, error: "Internal server error", data: null };
	}
};


export const deleteJobHandler = async (req) => {
	const { id } = req.params;

	if (!id) {
		return { success: false, error: "Job ID is required", data: null };
	}

	try {
		const job = await jobApplicationModel.findByIdAndDelete(id);

		if (!job) {
			return { success: false, error: "Job not found", data: null };
		}

		return { success: true, error: null, data: job };
	} catch (err) {
		console.error("Error deleting job:", err);
		return { success: false, error: "Internal server error", data: null };
	}
};
