import Joi from "joi";
import { validationSchema } from "../../utils/mongoDb";

const interviewDetailsSchema = Joi.object({
	round: Joi.number().integer().min(1),
	date: Joi.date(),
	type: Joi.string().valid("Phone", "Video", "On-site", "Technical", "HR"),
	notes: Joi.string().allow(null, "").max(500) // Optional with max length
});

const baseSchemaValidation = Joi.object({
	user: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId pattern
	companyName: Joi.string().trim(),
	role: Joi.string().trim(),
	status: Joi.string()
		.valid("Applied", "Interview Scheduled", "Offer Received", "Rejected")
		.default("Applied"),
	resume: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
	salary: Joi.object({
		offered: Joi.number().min(0).allow(null), // Optional and non-negative
		currency: Joi.string().default("INR")
	}).default({}),
	appliedOnDate: Joi.date().default(() => new Date(), "current date"),
	jobLink: Joi.string().uri().trim().allow(null, ""), // Optional and must be a valid URL if provided
	note: Joi.string().max(500).trim().allow(null, ""), // Optional with max length
	followUp: Joi.boolean().default(false),
	followUpDate: Joi.date().allow(null), // Optional
	contactInfo: Joi.object({
		name: Joi.string().trim().allow(null, ""), // Optional
		email: Joi.string().email().allow(null, ""), // Optional and must be a valid email if provided
		phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow(null, ""), // Optional and must follow E.164 format
		role: Joi.string().trim().allow(null, "") // Optional
	}).default({}),
	interviewDetails: Joi.array().items(interviewDetailsSchema).default([])// Defaults to an empty array
}).unknown(true); // Allow additional fields if necessary


const requiredFields = [
	"user",
	"companyName",
	"role",
	"resume",
	"interviewDetails.round",
	"interviewDetails.date",
	"interviewDetails.type"
];


export const validateImportedResumeForCreation = validationSchema({isUpdate:false, requiredFields , baseSchemaValidation });
export const validateImportedResumeForUpdate = validationSchema({isUpdate:true, requiredFields , baseSchemaValidation });