import { createPersonaHandler, updatePersonaHandler } from "../handlers/persona.handler.js";
import { getAllSectionsHandler } from "../handlers/sections.handler";
import { getAllTemplatesHandler } from "../handlers/template.handler.js";
import ResumeRecommendationEngine from "../logic/engine.js";


const handleCreateOrRetrievePersona = async (data) => {
	const { success, error, newPersona, existingObject } = await createPersonaHandler(data);
	return { success, error, newPersona, existingObject };
};

const handleGenerateRecommendations = async (persona) => {
	// Initialize the recommendation engine
	const engine = new ResumeRecommendationEngine();

	// Generate recommendations
	const { sectionOrder, contentAdvice, reasoning } = engine.generateRecommendations(persona);

	// Retrieve all sections
	const { success: sectionsSuccess, sections: allSections, error: sectionsError } = await getAllSectionsHandler();
	if (!sectionsSuccess) {
		return { success: false, error: sectionsError };
	}

	// Create recommendations
	const recommendations = createRecommendations(sectionOrder, allSections, contentAdvice, reasoning);

	return { success: true, recommendations };
};

const createRecommendations = (sectionOrder, allSections, contentAdvice, reasoning) => {
	const sectionMap = new Map(allSections.map((section) => [section.name, section._id]));

	const toDisplaySections = sectionOrder.map((sectionName, index) => {
		const sectionId = sectionMap.get(sectionName);
		if (sectionId) {
			return {
				serial_number: index + 1,
				name: sectionName,
				_id: sectionId
			};
		}
		console.warn(`Section "${sectionName}" not found in available sections.`);
		return null;
	}).filter(Boolean); // Remove nulls caused by invalid section names

	return {
		sections: toDisplaySections,
		contentAdvice,
		reasoning
	};
};

/**
 * Generates personalized template recommendations based on user's input data.
 * @param {Object} data - The input data representing the user's persona.
 * @returns {Object} - An object containing the recommended template sections, content advice, and reasoning.
 */

const getPersonaWithTemplateStructure = async (data) => {
	// Step 1: Create or Retrieve Persona
	const { success: personaSuccess, error: createPersonaError, newPersona, existingObject } = await handleCreateOrRetrievePersona(data);
	if (!personaSuccess) {
		return { success: false, error: createPersonaError };
	}
	if (existingObject) {
		return { success: true, persona: existingObject };
	}

	// Step 2: Generate Recommendations
	const { success: recommendationSuccess, recommendations, error: recommendationError } = await handleGenerateRecommendations(newPersona);
	if (!recommendationSuccess) {
		return { success: false, error: recommendationError };
	}

	// Step 3: Update Persona with Recommendations
	const { success: updatedPersonaSuccess, updatedPersona, error: updatedPersonaError } = await updatePersonaHandler(newPersona._id, {
		templateStructure: recommendations
	});
	if (!updatedPersonaSuccess) {
		return { success: false, error: updatedPersonaError };
	}

	return { success: true, persona: updatedPersona };
};


export const handleTemplateRecommendations = async (data) => {
	const {success,persona: { recommendations },error} = await getPersonaWithTemplateStructure(data);

	if (!success) {
		return { success: false, error };
	}

	return { success: true, recommendations };
};

export const handleRetrieveAllTemplates = async () => {
	const { success, allTemplates, error } = await getAllTemplatesHandler();

	if (!success) {
		return { success: false, error };
	}

	return { success: true, allTemplates };
};

export const filterTemplatesWithRecommendations = (allTemplates, recommendations) => {
	return allTemplates.map((template) => ({
		...template.toObject(), // Convert template to a plain JavaScript object
		sections: template.sections.filter((section) =>
			recommendations.sections.some((rec) => rec._id.toString() === section.section.toString())
		)
	}));
};

