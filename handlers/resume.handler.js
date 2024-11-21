import expressAsyncHandler from "express-async-handler";
import RESUME from "../models/ResumeForm";
import { resumeFormValidation } from "../validations/resume.validate";


// Create Resume
export const createResumeHandler = expressAsyncHandler(async (data) => {
	const { error, value } = resumeFormValidation.validate(data);
	if (error) {
		return { success: false, error }; // Return validation error message
	}
	const savedResume = await RESUME.create(value);
	return { success: true, savedResume };
});
  
// Update Resume by ID
export const updateResumeHandler = expressAsyncHandler(async (id, data) => {
	const { error, value } = resumeFormValidation.validate(data);
	if (error) {
		return { success: false, error}; // Return validation error message
	}
  
	const updatedResume = await RESUME.findByIdAndUpdate(id, value, {
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
	const deletedResume = await RESUME.findByIdAndDelete(id);
	if (!deletedResume) {
		return { success: false, error: "Resume not found" };
	}
  
	return { success: true, message: "Resume deleted successfully" };
});
  
// Get All Resumes
export const getAllResumesHandler = expressAsyncHandler(async () => {
	const resumes = await RESUME.find();
	return { success: true, resumes };
});
  
// Get One Resume by ID
export const getResumeByIdHandler = expressAsyncHandler(async (id) => {
	const resume = await RESUME.findById(id);
	if (!resume) {
		return { success: false, error: "Resume not found" };
	}
  
	return { success: true, resume };
});