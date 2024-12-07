import Joi from "joi";

const jobValidationSchema = Joi.object({
	userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
		"string.base": "User ID must be a string.",
		"string.pattern.base": "Invalid User ID format.",
		"any.required": "User ID is required."
	}),
	companyName: Joi.string().required().messages({
		"string.base": "Company Name must be a string.",
		"any.required": "Company Name is required."
	}),
	role: Joi.string().required().messages({
		"string.base": "Role must be a string.",
		"any.required": "Role is required."
	}),
	status: Joi.string()
		.valid("Applied", "Interview Scheduled", "Offer Received", "Rejected")
		.default("Applied")
		.messages({
			"any.only": "Status must be one of 'Applied', 'Interview Scheduled', 'Offer Received', or 'Rejected'."
		}),
	resume: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
		"string.base": "Resume ID must be a string.",
		"string.pattern.base": "Invalid Resume ID format.",
		"any.required": "Resume is required."
	}),
	appliedOnDate: Joi.date().default(Date.now).messages({
		"date.base": "Applied On Date must be a valid date."
	}),
	jobLink: Joi.string()
		.uri()
		.messages({
			"string.uri": "Job Link must be a valid URI."
		}),
	note: Joi.string()
		.max(500)
		.messages({
			"string.base": "Note must be a string.",
			"string.max": "Note cannot exceed 500 characters."
		}),
	followUp: Joi.boolean().default(false).messages({
		"boolean.base": "Follow Up must be a boolean."
	}),
	followUpDate: Joi.date().messages({
		"date.base": "Follow Up Date must be a valid date."
	}),
	events: Joi.array().items(
		Joi.object({
			date: Joi.date().required(),
			note: Joi.string().required()
		})
	).optional(),
	history: Joi.array().items(
		Joi.object({
			date: Joi.date().required(),
			note: Joi.string().required()
		})
	).optional()
});

export default jobValidationSchema;
