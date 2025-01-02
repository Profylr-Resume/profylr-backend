import Joi from "joi";
import { validationSchema } from "../../utils/mongoDb";

const baseSchemaValidation = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
	categories: Joi.array().items(Joi.string()).min(1),
	departments : Joi.array().items(Joi.string()).min(1)
});

const requiredFields = [
	"name",
	"categories",
	"departments"
];

export const validateResumeSectionForCreation = validationSchema({isUpdate:false, requiredFields , baseSchemaValidation });
export const validateResumeSectionForUpdate = validationSchema({isUpdate:true, requiredFields , baseSchemaValidation });
