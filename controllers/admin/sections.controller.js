import expressAsyncHandler from "express-async-handler";
import { createResumeSectionHandler, deleteResumeSectionHandler, getResumeSectionByIdHandler, getResumeSectionsHandler, updateResumeSectionHandler } from "../../handlers/modelConnection/resumeSection.handler.js";
import ApiResponse from "../../utils/responseHandlers.js";
import ApiError from "../../utils/errorHandlers.js";


export const createSection = expressAsyncHandler(async(req,res)=>{
    
	const section = await createResumeSectionHandler(req.body);

	if(section.success){
		ApiResponse.success(res,"Section created successfully.",section.data,201);
	}

});

export const getSections = expressAsyncHandler(async(req,res)=>{

	const sections = {};

	if(req.query){
		//req.query =>  categories, departments, name (possible filters))
		 sections = await getResumeSectionsHandler(req.query);

	}else if(req.params && req.params.id){
		// req.params
		 sections = await getResumeSectionByIdHandler(req.params.id);

	}else {
		 sections = await getResumeSectionsHandler();
	}

	if(sections){
		ApiResponse.success(res,"Sections fetched successfully.",sections.data,200);
	}
}); 

export const updateSection = expressAsyncHandler(async(req,res)=>{
    
	if(!req.query?.id){
		throw new ApiError(400,"Section is required to update the section.");
	}
	const {id} = req.query;
	const section = await updateResumeSectionHandler(id,req.body);

	if(section.success){
		ApiResponse.success(res,"Section id updated successfully.",section.data,200);
	}
});

export const deleteSection = expressAsyncHandler(async(req,res)=>{

	if(!req.query?.id){
		throw new ApiError(400,"Section id is required to delete the section.");
	}
	const {id} = req.query;
	const section = await deleteResumeSectionHandler(id);

	if(section.success){
		ApiResponse.success(res,"Section deleted successfully.",section.data,200);
	}
});