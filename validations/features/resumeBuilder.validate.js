import Joi from "joi";
import { baseSchemaValidationForBuildInResume } from "../buildInResume.validate.js";
import { baseSchemaValidationForImportedResume } from "../importedResume.validate.js";


const baseSchema = Joi.object({

	title: Joi.string().trim(),
	description: Joi.string().allow(null, ""), // Allow null or empty string
	isImported: Joi.boolean(),

	resumeData: Joi.when("resumeType", {
		switch :[
			{is: "BuildInResume", then : baseSchemaValidationForBuildInResume },
			{is: "ImportedResume", then : baseSchemaValidationForImportedResume }
		],
		otherwise: Joi.forbidden()
	}) ,

	resumeType: Joi.string().valid("BuildInResume", "ImportedResume"),
	status: Joi.string().valid("active", "archived", "deleted").default("active"),
	tags: Joi.array().items(Joi.string()).default([]),
	starred: Joi.boolean().default(false),
	lastUsed: Joi.date().allow(null), // Allow null for optional fields
	analytics: Joi.object({
		views: Joi.number().integer().min(0).default(0),
		downloads: Joi.number().integer().min(0).default(0),
		shares: Joi.number().integer().min(0).default(0),
		lastViewed: Joi.date().allow(null)
	}).default({}) // Default to an empty object
});