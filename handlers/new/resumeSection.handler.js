import expressAsyncHandler from "express-async-handler";
import RESUME_SECTION from "../../models/admin/ResumeSection.js";
import resumeSectionValidation from "../../validations/resumeSections.validate.js";

// basic CRUD

export const createSectionHandler = expressAsyncHandler( async (data) => {

	// Validate the sanitized data
	const { error, value } = resumeSectionValidation.validate(data);

	if (error) {
		return { success: false, error ,message:"Error in validation" };
	}

	// Create the new section
	const newSection = await RESUME_SECTION.create(value);

	return { success: true, newSection };
});

export const getAllSectionsHandler = expressAsyncHandler(async () => {
	
	// Fetch all sections
	const sections = await RESUME_SECTION.find();

	if (!sections || sections.length === 0) {
		return { success: true, error: "No sections found.", message:"No sections found." };
	}

	return { success: true, sections };
}) ;

export const getSectionByIdHandler = expressAsyncHandler( async (sectionId) => {
	
	if (!sectionId) {
		return { success: false, error: "Missing section ID" , message: "Missing Section id." };
	}

	// Find the Section document by ID
	const section = await RESUME_SECTION.findById(sectionId);

	if (!section) {
		return { success: false, error: "Section not found", message:"Section not found" };
	}

	return { success: true, section };
});

export const updateSectionHandler = expressAsyncHandler( async (sectionId, updatedData) => {

	if (!sectionId) {
		return { success: false, error: "Missing section ID" };
	}

	
	const { error, value } = resumeSectionValidation.validate(updatedData);

	if (error) {
		return { success: false, error };
	}

	// Update the Section document by ID
	const updatedSection = await RESUME_SECTION.findByIdAndUpdate(sectionId, value, { new: true });

	if (!updatedSection) {
		return { success: false, error: "Section not found" };
	}

	return { success: true, updatedSection };
});

export const deleteSectionHandler = expressAsyncHandler( async (sectionId) => {

	if (!sectionId) {
		return { success: false, error: "Missing section ID" };
	}

	// Find and delete the Section document by ID
	const deletedSection = await RESUME_SECTION.findByIdAndDelete(sectionId);

	if (!deletedSection) {
		return { success: false, error: "Section not found" };
	}

	return { success: true, deletedSection };
});

