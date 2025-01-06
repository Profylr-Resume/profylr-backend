// import expressAsyncHandler from "express-async-handler";
// import { conflictError, missingFieldsError, notFoundError } from "../../utils/errors.utils.js";
// import RESUME_SECTION from "../../models/ResumeSection.js";
// import { eventExecutedSuccessfully } from "../../utils/success.utils.js";
// import { createSectionHandler, deleteSectionHandler, getAllSectionsHandler, getSectionByIdHandler, updateSectionHandler } from "../../handlers/sections.handler.js";
// import resumeSectionValidation from "../../validations/resumeSections.validate.js";


// export const createSection = expressAsyncHandler(async(req,res)=>{

// 	const {error,value} = resumeSectionValidation.validate(req.body);
	
// 	if(error){
// 		return missingFieldsError(res,error);
// 	}

// 	const {name,description} = value;

// 	const trimmedName = name.trim();
// 	const trimmedDescription= description.trim();

// 	const alreadyExist = await RESUME_SECTION.find({name:trimmedName});

// 	if(alreadyExist && alreadyExist.length>0){
// 		return conflictError(res,"Section",["name"]);
// 	}
// 	const newSection = await RESUME_SECTION.create({name:trimmedName,description:trimmedDescription});

// 	return eventExecutedSuccessfully(res,{name:newSection,description:newSection.description},"New section created successfully.");

// });

// export const getAllSections = expressAsyncHandler(async (req, res) => {
// 	const { success, error, sections } = await getAllSectionsHandler();

// 	if (!success) {
// 		return res.status(404).json({ message: error });
// 	}

// 	return res.status(200).json(sections);
// });

// export const getSectionById = expressAsyncHandler(async (req, res) => {
// 	const sectionId = req.params.id;
// 	const { success, error, section } = await getSectionByIdHandler(sectionId);

// 	if (!success) {
// 		if (error === "Missing section ID") {
// 			return missingFieldsError(res);
// 		}
// 		return notFoundError(res, "Section", ["Id"]);
// 	}

// 	return eventExecutedSuccessfully(res, section, "Fetched section by ID");
// });

// export const updateSection = expressAsyncHandler(async (req, res) => {
// 	const sectionId = req.params.id;
// 	const { success, error, updatedSection } = await updateSectionHandler(sectionId, req.body);

// 	if (!success) {
// 		if (error === "Missing section ID") {
// 			return missingFieldsError(res);
// 		}
// 		return notFoundError(res, "Section", ["Id"]);
// 	}

// 	return eventExecutedSuccessfully(res, updatedSection, "Section updated successfully.");
// });

// export const deleteSection = expressAsyncHandler(async (req, res) => {
// 	const sectionId = req.params.id;
// 	const { success, error, deletedSection } = await deleteSectionHandler(sectionId);

// 	if (!success) {
// 		if (error === "Missing section ID") {
// 			return missingFieldsError(res);
// 		}
// 		return notFoundError(res, "Section", ["Id"]);
// 	}

// 	return eventExecutedSuccessfully(res, deletedSection, "Section deleted successfully.");
// });

  
