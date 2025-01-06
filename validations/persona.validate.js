import Joi from "joi";
import { validationSchema } from "../utils/mongoDb.js";

// Base schema (common for both create and update)
const baseSchemaValidation = Joi.object({
	experienceLevel: Joi.string().valid("fresher", "intermediate", "experienced"),
	targetRole: Joi.string(),
	background: Joi.object({
		yearsOfExperience: Joi.number().integer().positive(),
		education: Joi.object({
			level: Joi.string().valid("graduated", "inCollege", "postGraduate")
		}),
		hasProjects: Joi.boolean(),
		hasCertifications: Joi.boolean(),
		industries: Joi.array().items(Joi.string())
	}),
	strengths: Joi.array().items(Joi.string()).min(1) ,
	goals: Joi.array().items(Joi.string()).min(1)
});

// Define additional fields that should be required on creation
const requiredFields = [
	"experienceLevel",
	"targetRole",
	"background.yearsOfExperience",
	"background.education.level",
	"background.hasProjects",
	"background.hasCertifications",
	"strengths",
	"goals"
];


// Usage:
const validatePersonaForCreation = ()=> validationSchema({isUpdate:false, requiredFields , baseSchemaValidation });
const validatePersonaForUpdate = ()=> validationSchema({isUpdate:true, requiredFields , baseSchemaValidation });


export {validatePersonaForCreation,validatePersonaForUpdate};