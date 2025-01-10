import Joi from "joi";
import { validationSchema } from "../utils/mongoDb.js";


export const baseSchemaValidationForImportedResume = Joi.object({
	fileUrl: Joi.string().uri().trim(),
	fileType: Joi.string().valid("pdf", "doc", "docx"),
	originalfileName: Joi.string().min(3).max(50).trim(),
	fileSize : Joi.number()
});

const requiredFields = [
	"fileUrl",
	"fileType",
	"originalFileName",
	"fileSize"
];

export const validateImportedResumeForCreation = validationSchema({isUpdate:false, requiredFields , baseSchemaValidationForImportedResume });
export const validateImportedResumeForUpdate = validationSchema({isUpdate:true, requiredFields , baseSchemaValidationForImportedResume });