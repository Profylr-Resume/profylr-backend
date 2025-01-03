import expressAsyncHandler from "express-async-handler";
import BUILD_IN_RESUME from "../../models/BuildInResume.js";
import { validateBuildInResumeForCreation, validateBuildInResumeForUpdate } from "../../validations/buildInResume.validate.js";
import { validateIncomingData } from "../../utils/validations.js";
import ApiError from "../../utils/errorHandlers.js";


// Create Resume
export const createBuildInResumeHandler = expressAsyncHandler(async (data) => {

	const values = validateIncomingData(validateBuildInResumeForCreation,data);

	const savedResume = await BUILD_IN_RESUME.create(values);

	return { success: true, data : savedResume };
});
  
// Update Resume by ID
export const updateBuildInResumeHandler = expressAsyncHandler(async (id, updatedData) => {

	if(!id){
		throw new ApiError(400,"No resume id provided for updation.");
	}

	const values = validateIncomingData( validateBuildInResumeForUpdate, updatedData );

	const updatedResume = await BUILD_IN_RESUME.findByIdAndUpdate(id, { $set : values}, {
		new: true // Return the updated document
	});
  
	if (!updatedResume) {
		throw new ApiError(404,"No section found with given resume id.");
	}
  
	return { success: true, data : updatedResume };
});
  
// Delete Resume by ID
export const deleteBuildInResumeHandler = expressAsyncHandler(async (id) => {
	
	if(!id){
		throw new ApiError(400,"No resume id provided for deleteion.");
	}

	const deletedResume = await BUILD_IN_RESUME.findByIdAndDelete(id);

	if (!deletedResume) {
		throw new ApiError(404,"No section found with given resume id.");
	}
  
  
	return { success: true, data : deletedResume };
});
  
// Get One Resume by ID
export const getBuildInResumeByIdHandler = expressAsyncHandler(async (id) => {

	if(!id){
		throw new ApiError(400,"No resume id provided for get resume by id.");
	}

	const resume = await BUILD_IN_RESUME.findById(id);

	if(!resume){
		throw new ApiError(404,"No resume found with given id.");
	}
  
	return { success: true, data : resume };
});

// GET based on filters (for now i am not able ot think about filters)
export const getBuildInResumesHandler = expressAsyncHandler(async ({}) => {

	const resumes = await BUILD_IN_RESUME.find();

	if(!resumes){
		throw new ApiError(404,"No resume found.");
	}
	return { success: true, data : resumes };

});