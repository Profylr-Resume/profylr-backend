import ApiResponse from "../utils/responseHandlers.js";
import mongoose from "mongoose";

const errorHandler = (err, req, res, next) => {
	// Default status code is 500 for unhandled errors
	const statusCode = err.statusCode || 500;

	// Handle Validation Errors from Mongoose (e.g., required fields or invalid types)
	if (err instanceof mongoose.Error.ValidationError) {
		return ApiResponse.error(
			res,
			"Validation Error",
			400, 
			process.env.NODE_ENV === "development" ? { errors: err.errors } : undefined 
		);
	}

	// Handle Duplicate Key Errors (MongoDB error 11000), typically occurs when inserting a document
	// with a unique field that already exists in the database (e.g., an email that already exists).
	if (err.code === 11000) {
		const duplicateField = Object.keys(err.keyValue)[0]; // Get the field name (e.g., "email")
		const duplicateValue = err.keyValue[duplicateField]; // Get the value of the field (e.g., "hss@h.com")

		return ApiResponse.error(
			res,
			`${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} "${duplicateValue}" already exists.`, 
			400, 
			process.env.NODE_ENV === "development" ? { keyValue: err.keyValue } : undefined 
		);
	}

	// Handle CastError: This error occurs when MongoDB can't cast a value into a valid ObjectId,
	// which happens when an invalid or malformed ID is used, for example in query parameters.
	if (err instanceof mongoose.Error.CastError) {
		return ApiResponse.error(
			res,
			`Invalid ${err.path}: ${err.value}.`, 
			400,
			process.env.NODE_ENV === "development" ? { errors: err.message } : undefined 
		);
	}

	// Handle JSON Parsing Errors: This occurs when the incoming request body is not valid JSON.
	// It can happen if the client sends malformed JSON in the body of the request.
	if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
		return ApiResponse.error(
			res,
			"Invalid JSON payload.",
			400, 
			process.env.NODE_ENV === "development" ? { errors: err.message } : undefined 
		);
	}

	// Handle all other errors (e.g., internal server errors) that don't match the above specific cases.
	return ApiResponse.error(
		res,
		err.message || "Internal Server Error", 
		statusCode,
		process.env.NODE_ENV === "development" ? {
			stack: err.stack,
			errors: err.errors 
		} : undefined
	);
};

export default errorHandler;
