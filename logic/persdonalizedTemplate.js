import templateStructure from "./resume-template-structure.json";

const generateCustomizedResume = (personaRecommendations) => {
	const { sectionOrder, sectionVisibility, sectionContent } = personaRecommendations;

	let finalTemplate = templateStructure.html;

	// Replace the {sections} placeholder with the actual section HTML
	finalTemplate = finalTemplate.replace("{sections}", sectionOrder.map(sectionId => {
		const section = templateStructure.sections.find(s => s.id === sectionId);
		if (sectionVisibility[sectionId]) {
			return section.html.replace(/{(\w+)}/g, (match, variable) => {
				switch (variable) {
				case "name":
					return personaRecommendations.name;
				case "role":
					return personaRecommendations.targetRole;
				case "summary":
					return personaRecommendations.summary;
				case "experience_items":
					return sectionContent.experience.map((exp, index) => (
						`<div key=${index} class="mb-4">
                <h3 class="text-lg font-medium">${exp.company}</h3>
                <p class="text-gray-600">${exp.title}</p>
                <p>${exp.duration}</p>
                <p>${exp.description}</p>
              </div>`
					)).join("");
				default:
					return "";
				}
			});
		} 
		return "";
    
	}).join(""));

	return finalTemplate;
};

export { generateCustomizedResume };