import expressAsyncHandler from "express-async-handler";
import RESUME_SECTION from "../../models/admin/ResumeSection.js";
import { validateIncomingData } from "../../utils/validations.js";
import ApiError from "../../utils/errorHandlers.js";
import { validateResumeSectionForCreation } from "../../validations/resumeSections.validate.js";


// creating a new section with one-one tag for category and department
export const createResumeSectionHandler = expressAsyncHandler(async (data) => {
	try {
	  // Validate the incoming data
	  const values = validateIncomingData(validateResumeSectionForCreation, data);
  
	  // Create the new section
	  const newSection = await RESUME_SECTION.create(values);
  
	  return { success: true, data: newSection };
	} catch (err) {
	  // Database error handling
	  if (err.name === "SequelizeUniqueConstraintError") {
			throw new ApiError(400, "Duplicate section name is not allowed.");
	  }
	  // Re-throw the error to let expressAsyncHandler pass it to middleware
	  throw err;
	}
});
  
//  get section on the basis of filters
// Filters : category tag , department tag , name  (GET THESE IN PARAMS)
export const getResumeSectionsHandler = expressAsyncHandler(async ({ categories, departments, name } ) => {l;
	// assuming if multiple are sent => then intersection will be the result

	const query = {};

	if(categories){ // will give only those which contain all the categories asked in combine. ||ly for departments
		const categoryArray = Array.isArray(categories) ? categories : [categories];
		query.categories = { $all : categoryArray };
	}

	if(departments){
		const departmentArray = Array.isArray(departments) ? departments : [departments];
		query.departments = { $all : departmentArray };
	}

	if(name){
		query.name = { $regex: name, $options: "i" }; // 'i' makes it case-insensitive
	}
	
	// query = {categories:{$all:["Finance"]}}

	// Fetch all sections
	const sections = await RESUME_SECTION.find(query);

	if (!sections || sections.length === 0) {
		return ApiError(404,"No section found after filters.");
	}

	return { success: true, data :sections };
}) ;

//  section by id Get this in path
export const getResumeSectionByIdHandler = expressAsyncHandler( async (sectionId) => {
	
	if (!sectionId) {
		throw new ApiError(400,"Section ID not given");
	}

	// Find the Section document by ID
	const section = await RESUME_SECTION.findById(sectionId);

	if (!section) {
		throw new ApiError(404,"Section not found with provided section Id.");
	}

	return { success: true, data:section };
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

