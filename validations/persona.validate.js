import Joi from "joi";
import { makeFieldsRequired } from "../utils/mongoDb";

// Base schema (common for both create and update)
const personaBaseSchema = Joi.object({
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
	strengths: Joi.array().items(Joi.string()),
	goals: Joi.array().items(Joi.string())
});

// Define additional fields that should be required on creation
const requiredFieldsForCreation = [
	"experienceLevel",
	"targetRole",
	"background.yearsOfExperience",
	"background.education.level",
	"background.hasProjects",
	"background.hasCertifications",
	"strengths",
	"goals"
];

// Function to dynamically validate based on operation (create or update)
const getPersonaValidationSchema = (isUpdate = false) => {
	let schema = personaBaseSchema;
  
	// Add specific required fields for creation
	if (!isUpdate) {
		schema = makeFieldsRequired(schema, requiredFieldsForCreation);
	}
	else{// For update, make all fields optional
        
		schema = schema.fork(Object.keys(schema.describe().keys), (field) => {
			field.optional();
		});
	}
	
	return schema;
};

// Usage:
const validatePersonaForCreation = getPersonaValidationSchema(false); // For creation (all required)
const validatePersonaForUpdate = getPersonaValidationSchema(true); // For update (optional fields)


export {validatePersonaForCreation,validatePersonaForUpdate};