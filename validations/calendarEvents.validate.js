import Joi from "joi";

// Joi validation schema for calendar events
const calendarEventValidationSchema = Joi.object({
	userId: Joi.string().optional().messages({
		"string.empty": "User ID is required.",
		"any.required": "User ID is required."
	}),

	jobId: Joi.string().optional(),

	title: Joi.string().max(100).messages({
		"string.empty": "Title is required.",
		"any.required": "Title is required.",
		"string.max": "Title cannot exceed 100 characters."
	}),

	date: Joi.date().iso().required().messages({
		"date.base": "Date must be a valid ISO date.",
		"any.required": "Date is required."
	}),

	startTime: Joi.date().iso().optional().messages({
		"date.base": "Start time must be a valid ISO date."
	}),

	endTime: Joi.date().iso().optional().greater(Joi.ref("startTime")).messages({
		"date.base": "End time must be a valid ISO date.",
		"date.greater": "End time must be after start time."
	}),

	location: Joi.string().max(255).optional().messages({
		"string.max": "Location cannot exceed 255 characters."
	}),

	note: Joi.string().max(500).optional().messages({
		"string.max": "Note cannot exceed 500 characters."
	}),

	isAllDay: Joi.boolean().optional(),

	eventType: Joi.string()
		.valid("Meeting", "Task", "Reminder", "Other")
		.default("Other")
		.messages({
			"any.only": "Event type must be one of Meeting, Task, Reminder, or Other."
		}),

	priority: Joi.string()
		.valid("High", "Medium", "Low")
		.default("Medium")
		.messages({
			"any.only": "Priority must be one of High, Medium, or Low."
		}),

	isRecurring: Joi.boolean().optional(),

	recurrenceFrequency: Joi.string()
		.valid("Daily", "Weekly", "Monthly", "Yearly")
		.optional()
		.allow(null)
		.messages({
			"any.only": "Recurrence frequency must be one of Daily, Weekly, Monthly, or Yearly."
		}),

	reminder: Joi.number().integer().min(0).optional().default(15).messages({
		"number.base": "Reminder must be a number.",
		"number.min": "Reminder must be at least 0 minutes."
	}),

	status: Joi.string()
		.valid("Pending", "Completed", "Canceled")
		.default("Pending")
		.messages({
			"any.only": "Status must be one of Pending, Completed, or Canceled."
		})
});
export default calendarEventValidationSchema;