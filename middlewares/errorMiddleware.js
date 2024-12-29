import ApiResponse from "../utils/responseHandlers";

const errorHandler = (err, req, res, next) => {

	const statusCode = err.statusCode || 500;
  
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