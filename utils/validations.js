import ApiError from "./errorHandlers.js";

export const validateIncomingData = (schema,data)=>{

	const {value,error} = schema.validate(data , { abortEarly: false } );

	if(error){
		const errors = error.details.map(err=>err.message);
		throw new ApiError(400,"valdiation error",errors) ;
	}

	return value;
};