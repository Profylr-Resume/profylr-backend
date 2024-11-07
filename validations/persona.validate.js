import Joi from "joi";

const personaValidation = Joi.object({
	experienceLevel: Joi.string()
		.valid("fresher", "intermediate", "experienced")
		.required(),
	targetRole: Joi.string()
		.required(),
	background: Joi.object({
		yearsOfExperience: Joi.number()
			.integer()
			.positive()
			.required(),
		education: Joi.object({
			level: Joi.string()
				.valid("graduated", "inCollege", "postGraduate")
				.required()
		}),
		hasProjects: Joi.boolean()
			.required(),
		hasCertifications: Joi.boolean()
			.required(),
		industries: Joi.array()
			.items(Joi.string())
	}),
	strengths: Joi.array()
		.items(Joi.string())
		.required(),
	goals: Joi.array()
		.items(Joi.string())
		.required()
});

export default personaValidation;