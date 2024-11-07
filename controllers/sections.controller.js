import expressAsyncHandler from "express-async-handler";
import sanitizer from "sanitizer";
import resumeSectionValidation from "../validations/resumeSections.validate.js";
import { missingFieldsError, notFoundError } from "../utils/errors.utils.js";
import RESUME_SECTION from "../models/ResumeSection.js";
import { eventExecutedSuccessfully } from "../utils/success.utils.js";

const { sanitize } = sanitizer;


export const createSection = expressAsyncHandler(async(req,res)=>{

	const sanitizedData = sanitize(req.body);

	const {error,values} = resumeSectionValidation.validate(sanitizedData);

	if(error){
		return missingFieldsError(res,error);
	}

	const newSection = await RESUME_SECTION.create(values);

	return eventExecutedSuccessfully(res,newSection,"New section created successfully.");

});

export const getAllSections = expressAsyncHandler(async (req, res) => {
	const sections = await RESUME_SECTION.find();
  
	if (!sections || sections.length === 0) {
		return res.status(404).json({ message: "No sections found." });
	}
  
	return res.status(200).json(sections);
});

export const getSectionById = expressAsyncHandler(async (req, res) => {
	const sectionId = req.params.id;
  
	if(!sectionId){
		return missingFieldsError(res);
	}

	const section = await RESUME_SECTION.findById(sectionId);
  
	if (!section) {
		return notFoundError(res,"Section",["id"]);
	}
  
	return eventExecutedSuccessfully(res,section,"Fetched template by id");
});

export const updateSection = expressAsyncHandler(async (req, res) => {
	const sectionId = req.params.id;

	if(!sectionId){
		return missingFieldsError(res);
	}

	const sanitizedData = sanitize(req.body);
  
	const { error, values } = resumeSectionValidation.validate(sanitizedData);
  
	if (error) {
		return missingFieldsError(res, error);
	}
  
	const updatedSection = await RESUME_SECTION.findByIdAndUpdate(sectionId, values, { new: true });
  
	if (!updatedSection) {
		return notFoundError(res,"Section",["Id"]);
	}
  
	return eventExecutedSuccessfully(res, updatedSection, "Section updated successfully.");
});
  
export const deleteSection = expressAsyncHandler(async (req, res) => {
	const sectionId = req.params.id;
    
	if(!sectionId){
		return missingFieldsError(res);
	}

	const deletedSection = await RESUME_SECTION.findByIdAndDelete(sectionId);
  
	if (!deletedSection) {
		return notFoundError(res,"Section",["Id"]);
	}
  
	return eventExecutedSuccessfully(res, deletedSection, "Section deleted successfully.");
});
  
