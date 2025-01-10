import Joi from "joi";
import { validationSchema } from "../utils/mongoDb.js";

// Joi validation schema
const baseSchemaValidation = Joi.object({
	user: Joi.string()
		.pattern(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId pattern
	title: Joi.string().trim(),
	description: Joi.string()
		.allow(null, ""), // Allow null or empty string
	isImported: Joi.boolean(),
	resumeData: Joi.string()
		.pattern(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId pattern
	resumeType: Joi.string()
		.valid("BuiltResume", "ImportedResume"),
	status: Joi.string()
		.valid("active", "archived", "deleted").default("active"),
	tags: Joi.array()
		.items(Joi.string())
		.default([]),
	starred: Joi.boolean()
		.default(false),
	lastUsed: Joi.date()
		.allow(null), // Allow null for optional fields
	analytics: Joi.object({
		views: Joi.number().integer().min(0).default(0),
		downloads: Joi.number().integer().min(0).default(0),
		shares: Joi.number().integer().min(0).default(0),
		lastViewed: Joi.date().allow(null)
	}).default({}) // Default to an empty object
}).unknown(true); // Allow additional fields if necessary

const requiredFields = [
	"user",
	"title",
	"isImported",
	"resumeData",
	"resumeType"
];

export const validateResumeForCreation = validationSchema({isUpdate:false, requiredFields , baseSchemaValidation });
export const validateResumeForUpdate = validationSchema({isUpdate:true, requiredFields , baseSchemaValidation }); 