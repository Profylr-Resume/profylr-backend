import Joi from "joi";
import { makeFieldsRequired } from "../utils/mongoDb";

const baseSchemaValidation = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
	categories: Joi.array().items(Joi.string()).min(1),
	departments : Joi.array().items(Joi.string()).min(1)
});


const requiredFieldsForCreation = [
	"name",
	"categories",
	"departments"
];

const validationSchema = (isUpdate=false)=>{

	const schema = baseSchemaValidation;

	if(isUpdate){
		// Object.keys(schema.describe().keys) => ["name,description,categories,departments"]
		// schema.fork()  this needs an array of strings , and fn to modify each field

		schema = schema.fork( Object.keys(schema.describe().keys) , (field)=>{
			field.optional();
		});
	}else{
		schema = makeFieldsRequired(schema,requiredFieldsForCreation);
	}

	return schema;
};

export const validateResumeSectionForCreation = validationSchema(false);
export const validateResumeSectionForUpdate = validationSchema(true);
