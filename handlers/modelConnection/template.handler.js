import expressAsyncHandler from "express-async-handler";
import TEMPLATE from "../../models/admin/Template";
import { validateTemplateForCreation, validateTemplateForUpdate } from "../../validations/template.validate";
import { validateIncomingData } from "../../utils/validations";
import ApiError from "../../utils/errorHandlers";


export const createTemplateHandler = expressAsyncHandler( async (data) => {

	try{
		const values = validateIncomingData(validateTemplateForCreation,data);

		// Create and save the new Template document
		const newTemplate = await TEMPLATE.create(values);
	
		return { success: true, data:newTemplate };
	}
	catch(err){
		// Database error handling
		if (err.name === "SequelizeUniqueConstraintError") {
			throw new ApiError(400, "Duplicate template name is not allowed.");
		}
		// Re-throw the error to let expressAsyncHandler pass it to middleware
		throw err;
	}

});

export const updateTemplateHandler = expressAsyncHandler(async (templateId, updatedData) => {

	if (!templateId) {
		throw new ApiError(400,"Template id is not given for updation.");
	}

	const values = validateIncomingData(validateTemplateForUpdate,updatedData);

	// Find and update the Template document
	const updatedTemplate = await TEMPLATE.findByIdAndUpdate(templateId, { $set : values}, {
		new: true, // Return the updated document instead of the original
		runValidators: true // Enforce schema validation on the update
	});

	if (!updatedTemplate) {
		throw new ApiError(404,"Template not found for given template id.");
	}

	return { success: true, data:updatedTemplate };
});

export const getTemplateByIdHandler = expressAsyncHandler(async (templateId) => {

	if (!templateId) {
		throw new ApiError(400,"Template id is not given for getting template by id.");
	}

	// Find the Template document by ID
	const template = await TEMPLATE.findById(templateId);

	if (!template) {
		throw new ApiError(404,"Template not found for given template id.");
	}

	return { success: true, data:template };
});

export const getTemplatesHandler = expressAsyncHandler (async ({name,categories,departments}) => {
	
	const query = {};

	// it wont provide all templates of category1 and then all for category2 .
	//  it will provide all templates whrer category1 and category2 co-exist.
	// ||ly for departments

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
	
	// Fetch all templates
	const allTemplates = await TEMPLATE.find(query);

	if (!allTemplates || allTemplates.length === 0) {
		throw new ApiError(404,"No templates found");
	}

	return { success: true, data : allTemplates };
});

export const deleteTemplateHandler = expressAsyncHandler( async (templateId) => {
	
	if (!templateId) {
		throw new ApiError(400,"Template id is not given for deletion.");

	}

	// Find and delete the Template document by ID
	const deletedTemplate = await TEMPLATE.findByIdAndDelete(templateId);

	if (!deletedTemplate) {
		throw new ApiError(404,"Template not found for given template id or unable to delete the template");
	}

	return { success: true, data : deletedTemplate };
});

