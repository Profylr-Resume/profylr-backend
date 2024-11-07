import Joi from "joi";


export const registerValidation = Joi.object({
	name:Joi.string().required(),
	email:Joi.string().required(),
	password:Joi.string().required()
});