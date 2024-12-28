import expressAsyncHandler from "express-async-handler";
import TEMPLATE from "../../models/admin/Template";
import templateValidation from "../../validations/template.validate";

// Basic CRUD

export const createTemplateHandler = expressAsyncHandler( async (data) => {

	// Validate the sanitized data
	const { value, error } = templateValidation.validate(data);

	if (error) {
		return { success: false, error };
	}

	// Create and save the new Template document
	const newTemplate = await TEMPLATE.create(value);

	return { success: true, newTemplate };
});

export const updateTemplateHandler = expressAsyncHandler(async (templateId, data) => {

	if (!templateId) {
		return { success: false, error: "Missing template Id" };
	}

	const { error, value } = templateValidation.validate(data);

	if (error) {
		return { success: false, error };
	}

	// Find and update the Template document
	const updatedTemplate = await TEMPLATE.findByIdAndUpdate(templateId, value, {
		new: true, // Return the updated document instead of the original
		runValidators: true // Enforce schema validation on the update
	});

	if (!updatedTemplate) {
		return { success: false, error: "Template not found" };
	}

	return { success: true, updatedTemplate };
});

export const getTemplateByIdHandler = expressAsyncHandler(async (templateId) => {

	if (!templateId) {
		return { success: false, error: "Missing template ID" };
	}

	// Find the Template document by ID
	const template = await TEMPLATE.findById(templateId);

	if (!template) {
		return { success: false, error: "Template not found" };
	}

	return { success: true, template };
});

export const getAllTemplatesHandler = expressAsyncHandler (async () => {
	// Fetch all templates
	const allTemplates = await TEMPLATE.find();

	if (!allTemplates || allTemplates.length === 0) {
		return { success: false, error: "No templates found" };
	}

	return { success: true, allTemplates };
});

export const deleteTemplateHandler = expressAsyncHandler( async (templateId) => {
	if (!templateId) {
		return { success: false, error: "Missing template ID" };
	}

	// Find and delete the Template document by ID
	const deletedTemplate = await TEMPLATE.findByIdAndDelete(templateId);

	if (!deletedTemplate) {
		return { success: false, error: "Template not found" };
	}

	return { success: true, deletedTemplate };
});

