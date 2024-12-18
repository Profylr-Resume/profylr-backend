import CALENDAR_EVENT from "../../models/CalendarEventsModel.js";
import { internalServerError, missingFieldsError, notFoundError } from "../../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../../utils/success.utils.js";
import USER from "../../models/User.js";
import jobApplicationModel from "../../models/JobApplicationModel.js";
import calendarEventValidationSchema from "../../validations/calendarEvents.validate.js";
import mongoose from "mongoose";
import { createEventHandler, deleteAllEventHandler, deleteEventHandler, getEventHandler, updateEventHandler } from "../../handlers/events.handler.js";


export const createCalendarEvent = async (req, res) => {
	try {
		const { success, data, error } = await createEventHandler(req);

		if (!success) {
			// Return the error message if any
			return missingFieldsError(res, error || "Missing Fields");
		}

		// If success, return created event details
		return res.status(201).json({
			message: "Calendar event created successfully.",
			status: "success",
			event: data
		});
	} catch (error) {
		console.error("Error creating calendar event:", error);
		return res.status(500).json({
			message: "Internal server error.",
			status: "error"
		});
	}
};


/**
 * need to make only one GET endpoint.
 * Case 1 : add all the filters possible as of the schema provided 
 * CASE 2 : Start date and end date . it will more the less be covered in the above case . so if i porovide you some end date start 	  date you will provide me the events accordingly . 
 * if startDate given => then events after it
 * if end date given => then events after that
 * if both => events within that . 
 * StartDate will always be inclusive and enda te exclusive
 *  
 * CASE 3: Event Id => only that event.
 */



/**
 * Filters are based on below parameter
 *  id--> eventId,
 * userId,
 * jobId,
 * startDate,
 * endDate,
 * eventType,
 * priority,
 * isRecurring,
 * recurrenceFrequency
 *  sample route 
 *  http://localhost:3000/api/calendar-events?id=12345&startDate=2024-12-18&endDate=2024-12-31&jobId=67890&eventType=Meeting&priority=High&isRecurring=true&recurrenceFrequency=Daily
 * 
 *  http://localhost:3000/api/calendar-events?id=12345&
 * startDate=2024-12-18&
 * endDate=2024-12-31&
 * jobId=67890&
 * eventType=Meeting&
 * priority=High&
 * isRecurring=true&
 * recurrenceFrequency=Daily




*/
export const getCalendarEventsController = async (req, res) => {
	try {
		const { success, data } = await getEventHandler(req);

		if (!success) {
			return notFoundError(res, "No events found");
		}

		return eventExecutedSuccessfully(res, data);
	} catch (error) {
		return internalServerError(res, error.message);
	}
};



export const updateCalendarEventController = async (req, res) => {
	try {
		const { success, data, error } = await updateEventHandler(req);

		if (!success) {
			return res.status(400).json({
				message: error || "Unable to update the event.",
				status: "error"
			});
		}

		return res.status(200).json({
			message: "Event updated successfully.",
			status: "success",
			event: data
		});
	} catch (error) {
		console.error("Error updating calendar event:", error);
		return internalServerError(res, error.message);
	}
};

//  require event id
export const deleteCalendarEventController = async (req, res) => {
	try {
		const { success, data, error } = await deleteEventHandler(req);

		if (!success) {
			return res.status(400).json({
				message: error || "Failed to delete the event.",
				status: "error"
			});
		}

		if (!data) {
			return notFoundError(res, "No event found to delete.");
		}

		return eventExecutedSuccessfully(res, data, "Event deleted successfully.");
	} catch (error) {
		console.error("Error deleting calendar event:", error);
		return internalServerError(res, error.message);
	}
};

// require userId
export const deleteAllCalendarEventController = async (req, res) => {
	try {
		const { success, data, error } = await deleteAllEventHandler(req);

		if (!success) {
			return res.status(400).json({
				message: error || "Failed to delete all events.",
				status: "error"
			});
		}

		if (!data || data.deletedCount === 0) {
			return notFoundError(res, "No events found for the specified user.");
		}

		return eventExecutedSuccessfully(res, data, "All events deleted successfully.");
	} catch (error) {
		console.error("Error deleting all calendar events:", error);
		return internalServerError(res, error.message);
	}
};
  
  