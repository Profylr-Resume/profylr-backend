import expressAsyncHandler from "express-async-handler";
import BUILD_IN_RESUME from "../../models/BuildInResume.js";
import buildInResumeValidation from "../../validations/buildInResume.validate.js";


// Create Resume
export const createResumeHandler = expressAsyncHandler(async (data) => {

	const { error, value } = buildInResumeValidation.validate(data, {abortEarly:false});

	if (error) {
		return { success: false, error }; // Return validation error message
	}

	const savedResume = await BUILD_IN_RESUME.create(value);

	return { success: true, savedResume };
});
  
// Update Resume by ID
export const updateResumeHandler = expressAsyncHandler(async (id, data) => {

	const { error, value } = buildInResumeValidation.validate(data);

	if (error) {
		return { success: false, error}; // Return validation error message
	}
  
	const updatedResume = await BUILD_IN_RESUME.findByIdAndUpdate(id, value, {
		new: true, // Return the updated document
		runValidators: true // Run Mongoose validators
	});
  
	if (!updatedResume) {
		return { success: false, error: "Resume not found" };
	}
  
	return { success: true, updatedResume };
});
  
// Delete Resume by ID
export const deleteResumeHandler = expressAsyncHandler(async (id) => {
	const deletedResume = await BUILD_IN_RESUME.findByIdAndDelete(id);
	if (!deletedResume) {
		return { success: false, error: "Resume not found" };
	}
  
	return { success: true, message: "Resume deleted successfully" };
});
  
// Get All Resumes
export const getAllResumesHandler = expressAsyncHandler(async () => {
	const resumes = await BUILD_IN_RESUME.find();
	return { success: true, resumes };
});
  
// Get One Resume by ID
export const getResumeByIdHandler = expressAsyncHandler(async (id) => {
	const resume = await BUILD_IN_RESUME.findById(id);
	if (!resume) {
		return { success: false, error: "Resume not found" };
	}
  
	return { success: true, resume };
});