import Joi from "joi";
import { validationSchema } from "../utils/mongoDb";

// Validation schema for a single resume within a major version group
const resumeSchema = Joi.object({
	resumeRef: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
	minorVersion: Joi.number().integer().min(0),
	createdAt: Joi.date().default(() => new Date(), "current date"), 
	changeDescription: Joi.string().allow(null, ""), 
	tags: Joi.array().items(Joi.string()).default([]) 
});

// Validation schema for a major version group
const resumeGroupSchema = Joi.object({
	majorVersion: Joi.number()
		.integer()
		.min(1),
		
	resumes: Joi.array()
		.items(resumeSchema)
		.default([]) // Defaults to an empty array
});

// Main schema for ResumeVersionManager
const baseSchemaValidation = Joi.object({

	user: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
	resumeGroups: Joi.array().items(resumeGroupSchema).default([]), // Defaults to an empty array
	metadata: Joi.object({
		latestMajorVersion: Joi.number()
			.integer()
			.min(1)
			.default(1), // Defaults to 1
		totalResumes: Joi.number()
			.integer()
			.min(0)
			.default(1), // Defaults to 1
		lastUpdated: Joi.date()
			.default(() => new Date(), "current date") // Defaults to the current date
	}).default({}) // Defaults to an empty object
}).unknown(true); // Allow additional fields if necessary

const requiredFields = [
	"user",
	"resumeGroups.majorVersion",
	"resumeGroups.resumes.resumeRef",
	"resumeGroups.resumes.minorVersion"
];

export const validateResumeTimelineForCreation = validationSchema({isUpdate:false, requiredFields , baseSchemaValidation });
export const validateResumeTimelineForUpdate = validationSchema({isUpdate:true, requiredFields , baseSchemaValidation });

