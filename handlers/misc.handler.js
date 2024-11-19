import { filterTemplatesWithRecommendations, handleRetrieveAllTemplates, handleTemplateRecommendations } from "../helpers/misc.helper.js";

/**
 * Retrieves personalized templates based on the user's input data.
 * @param {Object} data - The input data representing the user's persona.
 * @returns {Object} - An object containing the personalized templates.
 */

export const personalizedTemplatesHandler = async (data) => {
	console.log(data);

	// Step 1: Generate personalized template recommendations
	const { success: recommendationsSuccess, recommendations, error: recommendationsError } = await handleTemplateRecommendations(data);
	if (!recommendationsSuccess) {
		return { success: false, error: recommendationsError };
	}

	// Step 2: Retrieve all available templates
	const { success: allTemplatesSuccess, allTemplates, error: allTemplatesError } = await handleRetrieveAllTemplates();
	if (!allTemplatesSuccess) {
		return { success: false, error: allTemplatesError };
	}

	// Step 3: Filter templates based on recommendations
	const personalizedTemplates = filterTemplatesWithRecommendations(allTemplates, recommendations);

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
