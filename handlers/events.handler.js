import mongoose from "mongoose";
import calendarEventValidationSchema from "../validations/calendarEvents.validate.js";
import CALENDAR_EVENT from "../models/CalendarEventsModel.js";


export const createEventHandler = async (data,userId) => {
	try {

		// Validate the request body using Zod
		const result = calendarEventValidationSchema.safeParse(data);

		// If validation fails, return error details
		if (!result.success) {
			return {
				success: false,
				data: null,
				error: result.error.errors.map((err) => err.message).join(", ")
			};
		}

		const validData = result.data;

		// Check if userId is available
		if (!userId) {
			return {
				success: false,
				data: null,
				error: "User ID not found"
			};
		}

		// Prepare event data with userId
		const eventData = { ...validData, userId };

		// Create the event
		const newEvent = await CALENDAR_EVENT.create(eventData);

		// Return success and new event data
		return { success: true, data: newEvent, error: null };
	} catch (error) {
		console.error("Error in createEventHandler:", error);
		return {
			success: false,
			data: null,
			error: "Internal error occurred while creating the event."
		};
	}
};

export const getEventHandler = async (req) => {
	
	const {id,startDate,endDate,jobId,eventType,priority,isRecurring,recurrenceFrequency} = req.query;

	const userId = req.user?._id;

	// Validate userId
	if (!userId) {
		throw new Error("User ID is required");
	}

	// Build the match conditions dynamically
	const matchConditions = { userId };

	// Validate and set ID
	if (id) {
		if (mongoose.Types.ObjectId.isValid(id)) {
			matchConditions._id = new mongoose.Types.ObjectId(id);
		} else {
			throw new Error("Invalid ID format");
		}
	}

	// Handle date range conditions
	if (startDate || endDate) {
		matchConditions.startDate = {};
		if (startDate) {
			matchConditions.startDate.$gte = new Date(startDate);
		}
		if (endDate) {
			matchConditions.startDate.$lt = new Date(endDate); // Exclusive of endDate
		}
	}

	// Other conditions
	if (jobId) {
		matchConditions.jobId = jobId;
	}

	if (eventType) {
		matchConditions.eventType = { $regex: eventType, $options: "i" }; // Case-insensitive regex
	}

	if (priority) {
		matchConditions.priority = { $regex: priority, $options: "i" };
	}

	if (isRecurring) {
		matchConditions.isRecurring = isRecurring === "true"; // Convert to boolean
	}

	if (recurrenceFrequency) {
		matchConditions.recurrenceFrequency = { $regex: recurrenceFrequency, $options: "i" };
	}

	const pipeline = [
		{
			$match: matchConditions // Apply the dynamic match conditions
		},
		{
			$group: {
				_id: "$date", // Group by the date field
				events: {
					$push: "$$ROOT" // Push the entire document for each event
				}
			}
		},
		{
			$sort: { _id: -1 } // Sort by date in descending order
		}
	];

	// Fetch events from the database
	const events = await CALENDAR_EVENT.aggregate(pipeline);

	if (!events || events.length === 0) {
		return { success: false, data: null };
	}

	return { success: true, data: events };
};


export const updateEventHandler = async (req) => {
	try {
		const { id } = req.params;

		// Validate the request body using Zod (or Joi if you're using it)
		const result = calendarEventValidationSchema.safeParse(req.body);

		// If validation fails, return error details
		if (!result.success) {
			return {
				success: false,
				data: null,
				error: result.error.errors.map((err) => err.message).join(", ")
			};
		}

		const validData = result.data;

		// Ensure the ID is valid
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return {
				success: false,
				data: null,
				error: "Invalid event ID format."
			};
		}

		// Update the event and return the updated document
		const updatedEvent = await CALENDAR_EVENT.findByIdAndUpdate(
			id,
			{ $set: validData },
			{ new: true }
		);

		if (!updatedEvent) {
			return {
				success: false,
				data: null,
				error: "Event not found or could not be updated."
			};
		}

		return { success: true, data: updatedEvent, error: null };
	} catch (error) {
		console.error("Error in updateEventHandler:", error);
		return {
			success: false,
			data: null,
			error: "Internal error occurred while updating the event."
		};
	}
};


export const deleteEventHandler = async (req) => {
	try {
		const { id } = req.params;

		// Validate the ID
		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return {
				success: false,
				data: null,
				error: "Invalid or missing event ID."
			};
		}

		// Attempt to delete the event
		const deletedEvent = await CALENDAR_EVENT.findByIdAndDelete(id);

		if (!deletedEvent) {
			return {
				success: false,
				data: null,
				error: "Event not found."
			};
		}

		return { success: true, data: deletedEvent, error: null };
	} catch (error) {
		console.error("Error in deleteEventHandler:", error);
		return {
			success: false,
			data: null,
			error: "Internal error occurred while deleting the event."
		};
	}
};


export const deleteAllEventHandler = async (req) => {
	try {
		const userId = req.user?._id;

		// Validate the userId
		if (!userId) {
			return {
				success: false,
				data: null,
				error: "User ID is required."
			};
		}

		// Delete all events associated with the given userId
		const result = await CALENDAR_EVENT.deleteMany({ userId });

		return { success: true, data: result, error: null };
	} catch (error) {
		console.error("Error in deleteAllEventHandler:", error);
		return {
			success: false,
			data: null,
			error: "Internal error occurred while deleting events."
		};
	}
};