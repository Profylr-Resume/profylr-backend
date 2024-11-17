import RESUME_SECTION from "../models/ResumeSection";
import resumeSectionValidation from "../validations/resumeSections.validate";


export const createSectionHandler = async (data) => {
	// Sanitize the input data

	// Validate the sanitized data
	const { error, value } = resumeSectionValidation.validate(data);

	if (error) {
		return { success: false, error };
	}

	// Create and save the new section
	const newSection = await RESUME_SECTION.create(value);

	return { success: true, newSection };
};

export const getAllSectionsHandler = async () => {
	// Fetch all sections
	const sections = await RESUME_SECTION.find();

	if (!sections || sections.length === 0) {
		return { success: false, error: "No sections found." };
	}

	return { success: true, sections };
};

export const getSectionByIdHandler = async (sectionId) => {
	if (!sectionId) {
		return { success: false, error: "Missing section ID" };
	}

	// Find the Section document by ID
	const section = await RESUME_SECTION.findById(sectionId);

	if (!section) {
		return { success: false, error: "Section not found" };
	}

	return { success: true, section };
};

export const updateSectionHandler = async (sectionId, data) => {
	if (!sectionId) {
		return { success: false, error: "Missing section ID" };
	}

	// Sanitize the input data

	// Validate the sanitized data
	const { error, value } = resumeSectionValidation.validate(data);

	if (error) {
		return { success: false, error };
	}

	// Update the Section document by ID
	const updatedSection = await RESUME_SECTION.findByIdAndUpdate(sectionId, value, { new: true });

	if (!updatedSection) {
		return { success: false, error: "Section not found" };
	}

	return { success: true, updatedSection };
};

export const deleteSectionHandler = async (sectionId) => {
	if (!sectionId) {
		return { success: false, error: "Missing section ID" };
	}

	// Find and delete the Section document by ID
	const deletedSection = await RESUME_SECTION.findByIdAndDelete(sectionId);

	if (!deletedSection) {
		return { success: false, error: "Section not found" };
	}

	return { success: true, deletedSection };
};

