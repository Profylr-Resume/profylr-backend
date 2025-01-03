import { validateIncomingData } from "../../utils/validations";
import JOB_TRACKING from "../../models/JobTracking.js";
import ApiError from "../../utils/errorHandlers.js";
import { validateJobTrackingForCreation, validateJobTrackingForUpdate } from "../../validations/jobTracking.validate";
import expressAsyncHandler from "express-async-handler";

// create
export const createJobTracking = expressAsyncHandler(async(data)=>{

	const values = validateIncomingData(validateJobTrackingForCreation,data);

	const jobTracking = await JOB_TRACKING.create(values);

	return {success : true , data : jobTracking};
});

// update
export const updateJobTracking = expressAsyncHandler(async(id , updatedData)=>{

	if(!id){
		throw new ApiError(400, "No job tracking id given for updation");
	}

	const values = validateIncomingData(validateJobTrackingForUpdate ,updatedData);

	const jobTracking = await JOB_TRACKING.findByIdAndUpdate(id,{$set : values}, {new : true});

	if(!jobTracking){
		throw new ApiError(404,"Job tracking not found with the given id.");
	}

	return {success: true , data : jobTracking};
});

// delete
export const deleteJobTracking = expressAsyncHandler(async (id)=>{

	if(!id){
		throw new ApiError(400, "No job tracking id given for deletion");
	}

	const jobTracking = await JOB_TRACKING.findByIdAndDelete(id);

	if(!jobTracking){
		throw new ApiError(404,"No job tracking found with given id or unable to delete the given job tracking.");
	}

	return {success: true, data : jobTracking};
});

// GET by Id
export const getJobTrackingById = expressAsyncHandler(async(id)=>{

	if(!id){
		throw new ApiError(400, "No job tracking id given.");
	}

	const jobTracking = await JOB_TRACKING.findById(id);

	if(!jobTracking){
		throw new ApiError(404, "Error finding the job tracking with given id.");
	}

	return {success:true , data : jobTracking};
});

// GET filters
export const getJobTracking = expressAsyncHandler(async({})=>{
    

});