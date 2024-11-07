

export const eventExecutedSuccessfully = (res,data,message)=>{
	return res.status(200).json({
		data,
		error:null,
		message:message
	});
};