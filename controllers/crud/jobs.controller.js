import calendarEventModel from "../../models/CalendarEventsModel.js";
import jobHistoryModel from "../../models/JobHistoryModel.js";
import jobModel from "../../models/JobModel.js";
import { internalServerError, missingFieldsError, notFoundError } from "../../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../../utils/success.utils.js";
import jobValidationSchema from "../../validations/jobs.validate.js";

// Job Creation

export const createJobController = async (req, res) => {
	try {
	 
	  const { error, value } = jobValidationSchema.validate(req.body, {abortEarly: false});
  
	  if (error) {
			return missingFieldsError(res, error);
	  }
  
	  const { userId, events } = value;
	  
	  delete value.events;
  
	  
	  const newJob = new jobModel(value);
	  await newJob.save();
	  
	

  
	  // Handle the events if provided
	  if (events && Array.isArray(events)) {
			const eventPromises = events.map(async (event) => {
		  const calendarEvent = new calendarEventModel({
					userId,
					jobId: newJob._id, // Link to the created job
					date: event.date,
					note: event.note
		  });
		  const savedEvent = await calendarEvent.save();
		  return savedEvent._id; // Return the event's ObjectId for linking
			});
  
			// Wait for all events to be saved and link their IDs to the job
			const savedEventIds = await Promise.all(eventPromises);
			newJob.events = savedEventIds;
			await newJob.save();
	  }
  
	  return eventExecutedSuccessfully(res, newJob, "Job and associated events added successfully");
	} catch (error) {
	  return internalServerError(res, error.message);
	}
};

// Update Job


export const updateJobController = async (req, res) => {
	try {
		const { id } = req.params;

		// Validate the request body
		const { error, value } = jobValidationSchema.validate(req.body, { abortEarly: false });
		if (error) {
			return missingFieldsError(res, error);
		}

		if (!id) {
			return res.status(400).send({ success: false, message: "Job ID is required" });
		}

		// Extract events from the request body
		const { events } = value;

		// Remove the events field from value to update only job fields
		delete value.events;

		// Fetch the job by ID
		const job = await jobModel.findById(id).populate("events").exec();
		if (!job) {
			return notFoundError(res, "Job not found");
		}

		// Track changes for jobHistory
		const oldData = {
			companyName: job.companyName,
			role: job.role,
			status: job.status,
			resume: job.resume,
			appliedOnDate: job.appliedOnDate,
			jobLink: job.jobLink,
			note: job.note,
			followUp: job.followUp,
			followUpDate: job.followUpDate,
			events: job.events.map(event => event._id) // Store only event IDs
		};

		const changedFields = Object.keys(value).filter(key => job[key] !== value[key]);

		if (changedFields.length === 0 && (!events || !events.length)) {
			return res.status(400).send({ success: false, message: "No changes detected" });
		}

		const newData = {
			...oldData,
			...value,
			events: events ? [...oldData.events, ...events.map(event => event._id)] : oldData.events
		};

		// Create jobHistory entry
		const newHistory = new jobHistoryModel({
			userId: job.userId,
			newData,
			oldData,
			changedFields
		});

		const savedHistory = await newHistory.save();

		// Push the history ID to the job's history array
		job.history.push(savedHistory._id);

		// Update the job fields (excluding events)
		Object.keys(value).forEach(key => {
			job[key] = value[key];
		});

		// Handle new events if provided
		if (events && Array.isArray(events)) {
			const newEventPromises = events.map(async event => {
				const newEvent = new calendarEventModel({
					userId: job.userId,
					jobId: job._id,
					date: event.date,
					note: event.note
				});
				const savedEvent = await newEvent.save();
				return savedEvent._id; // Return the new event's ObjectId for linking
			});

			const newEventIds = await Promise.all(newEventPromises);
			job.events.push(...newEventIds);
		}

		// Save the updated job
		await job.save();

		return eventExecutedSuccessfully(res, job, "Job updated and history recorded successfully");
	} catch (error) {
		return internalServerError(res, error.message);
	}
};

  
  
  

// Get All Jobs for a User
export const getAllJobsController = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).send({ success: false, message: "User ID is required" });
		}

		const jobs = await jobModel.find({ userId: id }).populate("resume").populate({path:"events",model:"calendarEvents"}).populate({path:"history",model:"JobHistory"}).sort({ createdAt: -1 });
		if (!jobs.length) {
			return notFoundError(res, "No jobs found for this user");
		}

		return res.status(200).json({ success: true, data: jobs });
	} catch (error) {
		return internalServerError(res, error.message);
	}
};

// Get Job by ID
export const getJobController = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).send({ success: false, message: "Job ID is required" });
		}

		const job = await jobModel.findById(id).populate("resume").populate({path:"events",model:"calendarEvents"}).populate({path:"history",model:"JobHistory"});
		if (!job) {
			return notFoundError(res, "Job not found");
		}

		return res.status(200).json({ success: true, data: job });
	} catch (error) {
		return internalServerError(res, error.message);
	}
};

// Delete All Jobs for a User
export const deleteAllJobsController = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).send({ success: false, message: "User ID is required" });
		}

		const result = await jobModel.deleteMany({ userId: id });
		if (result.deletedCount === 0) {
			return notFoundError(res, "No jobs found for this user");
		}

		return res.status(200).send({ success: true, message: "Deleted all jobs successfully" });
	} catch (error) {
		return internalServerError(res, error.message);
	}
};

// Delete Job by ID
export const deleteJobController = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).send({ success: false, message: "Job ID is required" });
		}

		const job = await jobModel.findByIdAndDelete(id);
		if (!job) {
			return notFoundError(res, "Job not found");
		}

		return res.status(200).send({ success: true, message: "Deleted job successfully" });
	} catch (error) {
		return internalServerError(res, error.message);
	}
};
