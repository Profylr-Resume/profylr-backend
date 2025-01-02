import Joi from "joi";
import { validationSchema } from "../../utils/mongoDb";

const baseSchemaValidation = Joi.object({
	profile: Joi.object({
		firstName: Joi.string(),
		lastName: Joi.string(),
		phone: Joi.string().pattern(/^[0-9]+$/)
	}),

	email: Joi.string().email(),

	password: Joi.string().min(6),

	meta: Joi.object({
		lastLogin: Joi.date().optional(),
		registrationDate: Joi.date().optional(),
		isVerified: Joi.boolean().optional(),
		verificationToken: Joi.string().optional(),
		resetPasswordToken: Joi.string().optional(),
		resetPasswordExpires: Joi.date().optional()
	}).optional()
});


const requiredFields = [
	"profile",
	"profile.firstName",
	"profile.lastName",
	"email",
	"password"
];

export const validateTemplateForCreation = validationSchema({isUpdate:false, requiredFields , baseSchemaValidation });
export const validateTemplateForUpdate = validationSchema({isUpdate:true, requiredFields , baseSchemaValidation });