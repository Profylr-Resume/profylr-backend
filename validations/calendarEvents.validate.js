import Joi from "joi";

const calendarEventValidationSchema = Joi.object({
	userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
		"string.base": "User ID must be a string.",
		"string.pattern.base": "Invalid User ID format.",
		"any.required": "User ID is required."
	}),
	jobId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
		"string.base": "Job ID must be a string.",
		"string.pattern.base": "Invalid Job ID format."
	}),
	date: Joi.date().required().messages({
		"date.base": "Date must be a valid date.",
		"any.required": "Date is required."
	}),
	note: Joi.string()
		.max(500)
		.messages({
			"string.base": "Note must be a string.",
			"string.max": "Note cannot exceed 500 characters."
		})
});

export default calendarEventValidationSchema;
