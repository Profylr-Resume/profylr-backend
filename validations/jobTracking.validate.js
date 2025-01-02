import Joi from "joi";

// things you need to set : applied on date , updated at date , history => these three come under the same umberella

const jobValidationSchema = Joi.object({

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

	// you can club these two  , if not the nneed ot show something else when false , so i can keep a check if true then show follwupdate as show other node . coz this is going to be on dashboard card 
	followUp: Joi.boolean().default(false).messages({
		"boolean.base": "Follow Up must be a boolean."
	}),
	followUpDate: Joi.date().messages({
		"date.base": "Follow Up Date must be a valid date."
	}),

	// this needs to be fulfilling for hte create calendar event schema
	events: Joi.array().items(
		Joi.object({
			date: Joi.date().required(),
			title:Joi.string().required(),
			description:Joi.string().required()
		})
	).optional()

	
});

export default jobValidationSchema;
