import expressAsyncHandler from "express-async-handler";
import sanitizer from "sanitizer";
import templateValidation from "../validations/template.validate.js";
import { conflictError, missingFieldsError, notFoundError } from "../utils/errors.utils.js";
import TEMPLATE from "../models/Template.js";
import {eventExecutedSuccessfully } from "../utils/success.utils.js";

const { sanitize } = sanitizer;


export const createTemplate = expressAsyncHandler(async(req,res)=>{

	  // Validate the data
	  const { value, error } = templateValidation.validate(req.body);
	console.log(error);
	  if (error) {
		return missingFieldsError(res, error);
	  }
	
	  // Check if a template with the same name already exists
	  const existingTemplate = await TEMPLATE.findOne({ name: value.name });
	
	  if (existingTemplate) {
		return conflictError(res, "Template",["name"]);
	  }
	
	  // Create the new template
	  const newTemplate = await TEMPLATE.create(value);
	
	  return eventExecutedSuccessfully(res, newTemplate, "Template created successfully");
});

export const updateTemplate = expressAsyncHandler(async(req,res)=>{

	const templateId = req.params.id;
    
	if(!templateId){
		return missingFieldsError(res);
	}
	const sanitizedData = sanitize(req.body);

	const {error,value} = templateValidation.validate(sanitizedData);

	if(error){
		return missingFieldsError(res,error);
	}
    
	const updatedTemplate = await TEMPLATE.findByIdAndUpdate(templateId, value, {
		new: true, // Return the updated document instead of the original
		runValidators: true // Enforce schema validation on the update
	});

	if(!updatedTemplate){
		return notFoundError(res,"Template",["Id"]);
	}
	return eventExecutedSuccessfully(res,updatedTemplate,"Template updated successfully.");
});

export const getTemplateById = expressAsyncHandler(async(req,res)=>{

	const templateId = req.params.id;

	if(!templateId){
		return missingFieldsError(res);
	}

	const template = await TEMPLATE.findById(templateId);

	if(!template){
		return notFoundError(res,"Template",["id"]);
	}

	return eventExecutedSuccessfully(res,template,"Template found");
});

// need to limit hte info , as it doesnt need everything here
export const getAllTemplates = expressAsyncHandler(async(req,res)=>{

	const allTemplates = await TEMPLATE.find();

	if(!allTemplates || !(allTemplates.length>0)){
		return notFoundError(res,"Template",["all templates"]);
	}

	return eventExecutedSuccessfully(res,allTemplates,"All templates fetched successfully");
});

export const deleteTemplate = expressAsyncHandler(async(req,res)=>{

	const templateId = req.params.id;

	if(!templateId){
		return missingFieldsError(res);
	}

	const deletedTemplate = await TEMPLATE.findByIdAndDelete(templateId);

	if(!deleteTemplate){
		return notFoundError(res,"Template",["id"]);
	}

	return eventExecutedSuccessfully(res,deletedTemplate,"Template deleted successfully");
});