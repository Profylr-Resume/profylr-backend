import { getAllSectionsHandler } from "../handlers/sections.handler.js";
import { getAllTemplatesHandler } from "../handlers/template.handler.js";
import ResumeRecommendationEngine from "../logic/engine.js";


export const handleGenerateRecommendations = async (persona) => {
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

