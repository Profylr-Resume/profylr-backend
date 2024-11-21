import Joi from "joi";

// Basic Info Schema
export const basicInfoSchema = Joi.object({
	name: Joi.string().required().min(2),
	github: Joi.string().uri(),
	linkedIn: Joi.string().uri(),
	email: Joi.string().email().required(),
	phoneNumber: Joi.string().pattern(/^\+?[\d\s-]+$/).required()
});

// Education Schema
export const educationSchema = Joi.object({
	underGraduate: Joi.object({
		instituteName: Joi.string().required(),
		field: Joi.string().required(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/).required(),
		result: Joi.string().required()
	}).required(),
	twelfthGrade: Joi.object({
		instituteName: Joi.string().required(),
		field: Joi.string().required(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/).required(),
		result: Joi.string().required()
	}).required(),
	tenthGrade: Joi.object({
		instituteName: Joi.string().required(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/).required(),
		result: Joi.string().required()
	}).required()
});

// Experience Schema
export const experienceSchema = Joi.object({
	organisationName: Joi.string().required(),
	position: Joi.string().required(),
	from: Joi.string().required().pattern(/^\d{4}-\d{2}$/),
	to: Joi.string().pattern(/^\d{4}-\d{2}$/),
	description: Joi.array().items(Joi.string()).min(1).required()
});

export const experiencesSchema = Joi.object({
	experiences: Joi.array().items(experienceSchema)
});

// Project Schema
export const projectSchema = Joi.object({
	name: Joi.string().required().min(3).trim(),
	technologiesUsed: Joi.array().items(Joi.string()).min(1).required(),
	from: Joi.string().required().pattern(/^\d{4}-\d{2}$/),
	to: Joi.string().pattern(/^\d{4}-\d{2}$/).custom((value, helpers) => {
		const from = helpers.state.ancestors[0].from;
		if (new Date(value) < new Date(from)) {
			return helpers.error("any.invalid");
		}
		return value;
	}, "End date validation"),
	sourceCodeRepository: Joi.string().uri(),
	liveLink: Joi.string().uri(),
	description: Joi.array().items(Joi.string()).min(1).required()
});

export const projectsSchema = Joi.object({
	projects: Joi.array().items(projectSchema)
});

// Skill Schema
export const skillSchema = Joi.object({
	name: Joi.string().required().trim(),
	proficiencyLevel: Joi.string()
		.valid("Beginner", "Intermediate", "Advanced", "Expert")
		.default("Intermediate"),
	yearsOfExperience: Joi.number().min(0).max(50),
	category: Joi.string().required().valid(
		"Programming Languages",
		"Frameworks & Libraries",
		"Databases",
		"Tools & Platforms",
		"Soft Skills",
		"Languages",
		"Certifications",
		"Other"
	),
	credentials: Joi.object({
		certificateUrl: Joi.string().uri(),
		issuingOrganization: Joi.string(),
		dateObtained: Joi.date(),
		expiryDate: Joi.date().min(Joi.ref("dateObtained"))
	})
});

export const skillsSchema = Joi.object({
	skills: Joi.array().items(skillSchema),
	categoryOrder: Joi.array().items(Joi.string()).default([
		"Programming Languages",
		"Frameworks & Libraries",
		"Databases",
		"Tools & Platforms",
		"Soft Skills",
		"Languages",
		"Certifications",
		"Other"
	])
});

// Main Resume Form Schema
export const resumeFormValidation = Joi.object({
	basicInfo: basicInfoSchema.required(),
	education: educationSchema.required(),
	skills: skillsSchema.required(),
	projects: projectsSchema.required(),
	experience: experiencesSchema.required()
});

