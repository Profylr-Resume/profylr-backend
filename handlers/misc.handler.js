import ResumeRecommendationEngine from "../logic/engine";
import { createPersonaHandler } from "./persona.handler";
import { getAllSectionsHandler } from "./sections.handler";
import { getAllTemplatesHandler } from "./template.handler";

/**
 * Generates personalized template recommendations based on user's input data.
 * @param {Object} data - The input data representing the user's persona.
 * @returns {Object} - An object containing the recommended template sections, content advice, and reasoning.
 */

const personalizedTemplateRecommendationsHandler = (data) => {

	// Create a new persona based on the input data
	const {success:personaSuccess,error:createPersonaError,newPersona} = createPersonaHandler(data);
  
	// If there's an error creating the persona, return the error
	if (!personaSuccess) {
		return { success: false, error: createPersonaError };
	}
  
	// Initialize the recommendation engine
	const engine = new ResumeRecommendationEngine();
  
	// Generate the recommendations based on the new persona
	const { sections, sectionOrder, contentAdvice, reasoning } = engine.generateRecommendations(newPersona);
  
	// Get all available sections from the system
	const { success:allSectionsSuccess, sections: allSections, error:allSectionsError } = getAllSectionsHandler();
  
	// If there's an error getting the sections, return null
	if (!allSectionsSuccess) {
		return {success:false,allSectionsError};
	}
  
	// Create a map for fast lookup of sections by name
	const sectionMap = new Map(allSections.map((section) => [section.name, section._id]));
  
	// Generate the final array with serial_number, name, and id
	const toDisplaySections = sectionOrder.map((sectionName, index) => {
		const sectionId = sectionMap.get(sectionName);
		if (sectionId) {
			return {
				serial_number: index + 1,
				name: sectionName,
				_id: sectionId
			};
		}
		return null; // Filter out invalid sections later
	}).filter(Boolean); // Remove any nulls caused by invalid section names
  
	// Construct the final result object
	const recommendations = {
		sections: toDisplaySections,
		contentAdvice,
		reasoning
	};
  
	return { success: true, recommendations };
};

/**
 * Retrieves personalized templates based on the user's input data.
 * @param {Object} data - The input data representing the user's persona.
 * @returns {Object} - An object containing the personalized templates.
 */

export const personalizedTemplatesHandler = (data) => {
	// Generate the personalized template recommendations
	const {success:recommendationsSuccess, recommendations, error:recommendationsError} = personalizedTemplateRecommendationsHandler(data);
  
	// If there's an error generating the recommendations, return the error
	if (!recommendationsSuccess) {
		return { success: false, error: recommendationsError };
	}
  
	// Get all available templates
	const { success: allTemplatesSuccess, allTemplates, error:allTemplatesError } = getAllTemplatesHandler();
  
	// If there's an error getting the templates, return the error
	if (!allTemplatesSuccess) {
		return { success: false, error:allTemplatesError };
	}
  
	// Filter the templates based on the recommended sections
	const personalizedTemplates = allTemplates.map((template) => ({
		...template.toObject(),
		sections: template.sections.filter((section) =>
			recommendations.sections.some((rec) => rec._id.toString() === section.section.toString())
		)
	}));
  
	return { success: true, personalizedTemplates };
};

// const recommendations = engine.generateRecommendations({
// 	experienceLevel: "Entry",
// 	targetRole: "Software Engineer",
// 	background: {
// 		yearsOfExperience: 0,
// 		educationLevel: "Bachelors",
// 		hasProjects: true,
// 		hasCertifications: false,
// 		industries: ["Technology"]
// 	},
// 	strengths: ["Technical Skills", "Project Experience"],
// 	goals: ["First Job"]
// });
