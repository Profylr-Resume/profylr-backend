// server/services/resumePersonaService.js
import { SECTION_IMPORTANCE } from "../models/Template";

const analyzePersona = (persona) => {
	let roleCategory = "";
	// Determine role category
	Object.entries(roleCategories).forEach(([category, roles]) => {
		if (roles.includes(persona.targetRole)) {
			roleCategory = category;
		}
	});

	// Get section importance from the existing SECTION_IMPORTANCE
	const sectionImportance = SECTION_IMPORTANCE[roleCategory];

	// Generate recommendations based on persona
	const recommendations = {
		sectionFields:[],
		sectionOrder: [],
		visibilitySuggestions: [],
		contentAdvice: [],
		reasoning: []
	};

	// Add section order recommendations
	if (persona.experienceLevel === "fresher") {
		if (persona.background.hasProjects) {
			recommendations.sectionOrder = ["projects", "skills", "education", "experience"];
			recommendations.reasoning.push("As a fresher with projects, leading with your practical experience will make you stand out");
		} else {
			recommendations.sectionOrder = ["education", "skills", "projects", "experience"];
			recommendations.reasoning.push("Your academic background will be your strongest asset as a fresher");
		}
	} else {
		recommendations.sectionOrder = ["experience", "skills", "projects", "education"];
		recommendations.reasoning.push("Your work experience should be highlighted first to demonstrate your industry expertise");
	}

	// Add visibility suggestions
	if (persona.background.hasCertifications) {
		recommendations.visibilitySuggestions.push("Include a certifications section to validate your technical skills");
	}

	if (persona.strengths.includes("Research Publications")) {
		recommendations.visibilitySuggestions.push("Add a publications section to showcase your research contributions");
	}

	// Add content advice
	if (roleCategory === "TECHNICAL_ROLES") {
		recommendations.contentAdvice.push("Focus on quantifiable achievements in your projects and experience");
		recommendations.contentAdvice.push("List technical skills with proficiency levels");
	} else if (roleCategory === "RESEARCH_ROLES") {
		recommendations.contentAdvice.push("Emphasize research methodologies and academic achievements");
		recommendations.contentAdvice.push("Include relevant coursework and thesis details");
	}

	return recommendations;
};

export { analyzePersona };