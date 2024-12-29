import Joi from "joi";
import { makeFieldsRequired } from "../utils/mongoDb";

const baseValidationSchema = Joi.object({
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


const requiredFieldsForCreation = [
	"name",
	"sections"
];


const validationSchema = (isUpdate=false)=>{
	
	const schema = baseValidationSchema;

	if(isUpdate){

		schema = schema.fork( Object.keys(schema.describe().keys) ,(field)=>{
			field.optional();
		});
	}
	else{
		schema = makeFieldsRequired(schema,requiredFieldsForCreation);
	}
	return schema;
};

export const validateTemplateForCreation = validationSchema(false);
export const validateTemplateForUpdate = validationSchema(true);
  