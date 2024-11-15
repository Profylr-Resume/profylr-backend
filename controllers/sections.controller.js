import expressAsyncHandler from "express-async-handler";
import { missingFieldsError, notFoundError } from "../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../utils/success.utils.js";
import { createSectionHandler, deleteSectionHandler, getAllSectionsHandler, getSectionByIdHandler, updateSectionHandler } from "../handlers/sections.handler.js";

export const createSection = expressAsyncHandler(async (req, res) => {
	const { success, error, newSection } = await createSectionHandler(req.body);

	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, newSection, "New section created successfully.");
});

export const getAllSections = expressAsyncHandler(async (req, res) => {
	const { success, error, sections } = await getAllSectionsHandler();

	if (!success) {
		return res.status(404).json({ message: error });
	}

	return res.status(200).json(sections);
});

export const getSectionById = expressAsyncHandler(async (req, res) => {
	const sectionId = req.params.id;
	const { success, error, section } = await getSectionByIdHandler(sectionId);

	if (!success) {
		if (error === "Missing section ID") {
			return missingFieldsError(res);
		}
		return notFoundError(res, "Section", ["Id"]);
	}

	return eventExecutedSuccessfully(res, section, "Fetched section by ID");
});

export const updateSection = expressAsyncHandler(async (req, res) => {
	const sectionId = req.params.id;
	const { success, error, updatedSection } = await updateSectionHandler(sectionId, req.body);

	if (!success) {
		if (error === "Missing section ID") {
			return missingFieldsError(res);
		}
		return notFoundError(res, "Section", ["Id"]);
	}

	return eventExecutedSuccessfully(res, updatedSection, "Section updated successfully.");
});

export const deleteSection = expressAsyncHandler(async (req, res) => {
	const sectionId = req.params.id;
	const { success, error, deletedSection } = await deleteSectionHandler(sectionId);

	if (!success) {
		if (error === "Missing section ID") {
			return missingFieldsError(res);
		}
		return notFoundError(res, "Section", ["Id"]);
	}

	return eventExecutedSuccessfully(res, deletedSection, "Section deleted successfully.");
});

  
