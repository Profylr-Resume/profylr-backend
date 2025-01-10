import expressAsyncHandler from "express-async-handler";
import { createTemplateHandler, deleteTemplateHandler, getTemplateByIdHandler, getTemplatesHandler, updateTemplateHandler } from "../../handlers/modelConnection/template.handler.js";
import ApiResponse from "../../utils/responseHandlers.js";
import ApiError from "../../utils/errorHandlers.js";


export const createTemplate = expressAsyncHandler(async(req,res)=>{

	const template = await createTemplateHandler(req.body);

	if(template.success){
		ApiResponse.success(res,"Templated created successfully!",template,201);
	}

});

export const getTemplates = expressAsyncHandler(async(req,res)=>{

	const templates = {};
    
	if(req.query){
		//req.query =>  categories, departments, name (possible filters))
		templates = await getTemplatesHandler(req.query);
    
	}else if(req.params && req.params.id){
		// req.params
		templates = await getTemplateByIdHandler(req.params.id);
    
	}else {
		templates = await getTemplatesHandler();
	}
    
	if(templates){
		ApiResponse.success(res,"Templates fetched successfully.",templates.data,200);
	}

});

export const updateTemplate = expressAsyncHandler(async(req,res)=>{
    
	if(!req.query?.id){
		throw new ApiError(400,"Template id is required to update the template.");
	}
	const {id} = req.query;
	const template = await updateTemplateHandler(id,req.body);
    
	if(template.success){
		ApiResponse.success(res,"Template updated successfully.",template.data,200);
	}
});

export const deleteTemplate = expressAsyncHandler(async(req,res)=>{
	if(!req.query?.id){
		throw new ApiError(400,"Template id is required to delete the template.");
	}
	const {id} = req.query;
	const template = await deleteTemplateHandler(id);
    
	if(template.success){
		ApiResponse.success(res,"Template deleted successfully.",template.data,200);
	}
});

