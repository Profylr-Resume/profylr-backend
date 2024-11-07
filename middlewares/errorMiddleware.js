const errorHandler = (err, req, res, next) => {
	console.error(err.stack);
  
	// Determine the appropriate HTTP status code based on the error
	const statusCode = err.statusCode ? err.statusCode : 500;
  
	return res.status(statusCode).json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
		data:null
	});
};
  
export default errorHandler;