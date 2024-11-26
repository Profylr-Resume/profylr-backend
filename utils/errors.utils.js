

export const missingFieldsError = (res,error)=>{
    
	return res.status(400).json({
		data: null,
		message: "Missing or invalid fields",
		error: error ? error.details.map((detail) => detail.message) : "error"
	});
};


export const internalServerError = (res, error) => {
	const errorMessage =
      (error?.data?.response?.message) || 
      (error?.message) || 
      "An unexpected error occurred";
  
	res.status(500).json({
		data: null,
		message: "Internal server error",
		error: errorMessage
	});
};
  
export const notFoundError = (res,subject,missingItems)=>{
	return res.status(404).json({
		data: null,
		message: `${subject} not found`,
		error: `The ${subject} with the specified ${missingItems.join(", ")} does not exist.`
	  });
};

export const conflictError = (res, subject, existingItems) => {
	return res.status(409).json({
	  data: null,
	  message: `${subject} already exists`,
	  error: `The ${subject} with the specified ${existingItems.join(", ")} already exists in the database.`
	});
};

export const devError = (res,error)=>{

	return res.status(400).json({
		data:null,
		message:"Coding error",
		error
	});
};
  