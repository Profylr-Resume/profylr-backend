import ApiError from "../utils/errorHandlers";


// this is being used as a middleware here , but made same as a function also
const validateRequestMiddleware = (schema) => {
	return (req, res, next) => {
		const { error } = schema.validate(req.body, { abortEarly: false });
      
		if (error) {
			const errors = error.details.map(detail => detail.message);
			throw new ApiError(400, "Validation Error", errors);
		}
      
		next();
	};
};

export default validateRequestMiddleware;