import Joi from "joi";
import { validationSchema } from "../utils/mongoDb.js";

const baseSchemaValidation = Joi.object({
	name: Joi.string(), 
	description: Joi.string().optional(), 
	html: Joi.string().optional(), 
	sections: Joi.array().items(
	  Joi.object({
			section: Joi.string().required(), // Make required at the item level
			html: Joi.string().required() // Make required at the item level
	  })
	).min(1), // Ensure at least one section exists
	thumbnail: Joi.string().optional() 
});


const requiredFields = [
	"name",
	"sections"
];


export const validateTemplateForCreation = validationSchema({isUpdate:false, requiredFields , baseSchemaValidation });
export const validateTemplateForUpdate = validationSchema({isUpdate:true, requiredFields , baseSchemaValidation });
  