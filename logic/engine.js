// Resume Section Weights and Constraints
const SECTION_WEIGHTS = {
	header: 0.08, // ~8% of page
	summary: 0.15, // ~15% of page
	experience: 0.25, // ~25% of page
	projects: 0.20, // ~20% of page
	education: 0.15, // ~15% of page
	skills: 0.12, // ~12% of page
	certifications: 0.10,
	achievements: 0.12,
	publications: 0.15,
	research: 0.20,
	volunteer: 0.10
};

const roleCategories = {
	TECHNICAL_ROLES: ["Software Engineer", "Data Scientist", "DevOps Engineer"],
	RESEARCH_ROLES: ["Research Scientist", "Research Assistant", "PhD Candidate"],
	BUSINESS_ROLES: ["Product Manager", "Business Analyst", "Project Manager"]
};
  
class ResumeRecommendationEngine {

	constructor() {
		this.totalPageSpace = 1.0; // Represents one A4 page
	}
  
	generateRecommendations(persona) {
		
		const recommendations = {
			sections: [],
			sectionOrder: [],
			contentAdvice: [],
			reasoning: []
		};
  
		// Step 1: Analyze career stage and determine primary focus
		const careerStage = this.analyzeCareerStage(persona);
		recommendations.reasoning.push(`Career Stage Analysis: ${careerStage}`);
  
		// Step 2: Select essential sections
		const essentialSections = this.selectEssentialSections(persona, careerStage);
		recommendations.sections = essentialSections;
		recommendations.reasoning.push(`Selected ${essentialSections.length} essential sections based on career stage and background`);
  
		// Step 3: Determine optimal section order
		recommendations.sectionOrder = this.determineSectionOrder(essentialSections, persona);
      
		// Step 4: Generate content advice
		recommendations.contentAdvice = this.generateContentAdvice(persona, essentialSections);
  
		return recommendations;
	}
  
	analyzeCareerStage(persona) {
		const { experienceLevel, background, goals } = persona;
      
		if (background.yearsOfExperience === 0 && goals.includes("First Job")) {
			return "ENTRY_LEVEL";
		} else if (background.yearsOfExperience <= 3) {
			return "EARLY_CAREER";
		} else if (background.yearsOfExperience <= 7) {
			return "MID_CAREER";
		}
		return "SENIOR_LEVEL";
	}
  
	selectEssentialSections(persona, careerStage) {
		const sections = new Set(["header"]); // Header is always included
		let spaceUsed = SECTION_WEIGHTS.header;
      
		// Add sections based on career stage and background
		if (this.shouldIncludeSection("summary", persona, careerStage)) {
			sections.add("summary");
			spaceUsed += SECTION_WEIGHTS.summary;
		}
  
		// Experience section logic
		if (persona.background.yearsOfExperience > 0) {
			sections.add("experience");
			spaceUsed += SECTION_WEIGHTS.experience;
		}
  
		// Education section logic
		if (persona.background.educationLevel || careerStage === "ENTRY_LEVEL") {
			sections.add("education");
			spaceUsed += SECTION_WEIGHTS.education;
		}
  
		// Projects section logic
		if (persona.background.hasProjects || careerStage === "ENTRY_LEVEL" || persona.goals.includes("Career Transition")) {
			sections.add("projects");
			spaceUsed += SECTION_WEIGHTS.projects;
		}
  
		// Skills section logic
		if (persona.strengths.includes("Technical Skills") || this.isInTechnicalField(persona.targetRole)) {
			sections.add("skills");
			spaceUsed += SECTION_WEIGHTS.skills;
		}
  
		// Research and Publications logic
		if (this.isResearchFocused(persona)) {
			sections.add("research");
			sections.add("publications");
			spaceUsed += SECTION_WEIGHTS.research + SECTION_WEIGHTS.publications;
		}
  
		// Certifications logic
		if (persona.background.hasCertifications) {
			sections.add("certifications");
			spaceUsed += SECTION_WEIGHTS.certifications;
		}
  
		return Array.from(sections);
	}
  
	shouldIncludeSection(section, persona, careerStage) {
		switch (section) {
		case "summary":
			return careerStage !== "ENTRY_LEVEL" || persona.goals.includes("Career Transition") || persona.goals.includes("Industry Switch");
			// Add more section-specific logic as needed
		default:
			return false;
		}
	}
  
	isInTechnicalField(targetRole) {
		return roleCategories.TECHNICAL_ROLES.includes(targetRole);
	}
  
	isResearchFocused(persona) {
		return roleCategories.RESEARCH_ROLES.includes(persona.targetRole) ||
             persona.strengths.includes("Research Publications") ||
             persona.goals.includes("Research Opportunity");
	}
  
	determineSectionOrder(sections, persona) {
		const orderPriority = {
			"header": 1,
			"summary": 2,
			"experience": 3,
			"research": 4,
			"projects": 5,
			"publications": 6,
			"education": 7,
			"skills": 8,
			"certifications": 9,
			"achievements": 10,
			"volunteer": 11
		};
  
		// Special ordering rules based on persona
		if (persona.goals.includes("First Job") || persona.background.yearsOfExperience === 0) {
			orderPriority.education = 3;
			orderPriority.projects = 4;
			orderPriority.experience = 5;
		}
  
		return sections.sort((a, b) => orderPriority[a] - orderPriority[b]);
	}
  
	generateContentAdvice(persona, sections) {
		const advice = [];
  
		sections.forEach(section => {
			switch (section) {
			case "summary":
				if (persona.goals.includes("Career Transition")) {
					advice.push("Summary: Focus on transferable skills and align previous experience with new role");
				}
				break;
			case "experience":
				const yearsExp = persona.background.yearsOfExperience;
				advice.push(`Experience: ${yearsExp < 3 ? "Focus on achievements and metrics" : "Highlight leadership and strategic impact"}`);
				break;
			case "projects":
				if (persona.background.hasProjects) {
					advice.push("Projects: Emphasize technical complexity and business impact");
				}
				break;
			default :
				break;
          // Add more section-specific advice
			}
		});
  
		return advice;
	}
  
	getRemainingSpace(selectedSections) {
		const usedSpace = selectedSections.reduce((total, section) => 
			total + (SECTION_WEIGHTS[section] || 0), 0);
		return Math.max(0, this.totalPageSpace - usedSpace);
	}
}
  
export default ResumeRecommendationEngine;