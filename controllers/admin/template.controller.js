// import expressAsyncHandler from "express-async-handler";
// import sanitizer from "sanitizer";
// import templateValidation from "../../validations/template.validate.js";
// import { conflictError, missingFieldsError, notFoundError } from "../../utils/errors.utils.js";
// import TEMPLATE from "../../models/Template.js";
// import {eventExecutedSuccessfully } from "../../utils/success.utils.js";
// import { createTemplateHandler, deleteTemplateHandler, getAllTemplatesHandler, getTemplateByIdHandler, updateTemplateHandler } from "../../handlers/template.handler.js";


// export const createTemplate = expressAsyncHandler(async(req,res)=>{

// 	  // Validate the data
// 	  const { value, error } = templateValidation.validate(req.body);
// 	  if (error) {
// 		return missingFieldsError(res, error);
// 	  }
	
// 	  // Check if a template with the same name already exists
// 	  const existingTemplate = await TEMPLATE.findOne({ name: value.name });
	
// 	  if (existingTemplate) {
// 		return conflictError(res, "Template",["name"]);
// 	  }
	
// 	  // Create the new template
// 	  const newTemplate = await TEMPLATE.create(value);
	
// 	  return eventExecutedSuccessfully(res, newTemplate, "Template created successfully");
// });

// export const updateTemplate = expressAsyncHandler(async (req, res) => {
// 	const templateId = req.params.id;
// 	const { success, error, updatedTemplate } = await updateTemplateHandler(templateId, req.body);

// 	if (!success) {
// 		if (error === "Missing template ID") {
// 			return missingFieldsError(res);
// 		}
// 		return notFoundError(res, "Template", ["Id"]);
// 	}

// 	return eventExecutedSuccessfully(res, updatedTemplate, "Template updated successfully.");
// });

// export const getTemplateById = expressAsyncHandler(async (req, res) => {
// 	const templateId = req.params.id;
// 	const { success, error, template } = await getTemplateByIdHandler(templateId);

// 	if (!success) {
// 		if (error === "Missing template ID") {
// 			return missingFieldsError(res);
// 		}
// 		return notFoundError(res, "Template", ["Id"]);
// 	}

// 	return eventExecutedSuccessfully(res, template, "Template found");
// });

// export const getAllTemplates = expressAsyncHandler(async (req, res) => {
// 	const { success, error, allTemplates } = await getAllTemplatesHandler();

// 	if (!success) {
// 		return notFoundError(res, "Template", ["all templates"]);
// 	}

// 	return eventExecutedSuccessfully(res, allTemplates, "All templates fetched successfully");
// });

// export const deleteTemplate = expressAsyncHandler(async (req, res) => {
// 	const templateId = req.params.id;
// 	const { success, error, deletedTemplate } = await deleteTemplateHandler(templateId);

// 	if (!success) {
// 		if (error === "Missing template ID") {
// 			return missingFieldsError(res);
// 		}
// 		return notFoundError(res, "Template", ["Id"]);
// 	}

// 	return eventExecutedSuccessfully(res, deletedTemplate, "Template deleted successfully");
// });
