import { Schema } from "mongoose";

// Individual skill schema
const skillSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	proficiencyLevel: {
		type: String,
		enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
		default: "Intermediate"
	},
	yearsOfExperience: {
		type: Number,
		min: 0,
		max: 50
	},
	category: {
		type: String,
		required: true,
		enum: [
			"Programming Languages",
			"Frameworks & Libraries",
			"Databases",
			"Tools & Platforms",
			"Soft Skills",
			"Languages",
			"Certifications",
			"Other"
		]
	},
	
	// Optional: for certifications or verifiable skills
	credentials: {
		certificateUrl: String,
		issuingOrganization: String,
		dateObtained: Date,
		expiryDate: Date
	}
});

// Main skills section schema
export const skillsSchema = new Schema({

	skills: [skillSchema],
	// Optional: For grouping skills by categories with custom ordering
	categoryOrder: {
		type: [String],
		default: [
			"Programming Languages",
			"Frameworks & Libraries",
			"Databases",
			"Tools & Platforms",
			"Soft Skills",
			"Languages",
			"Certifications",
			"Other"
		]
	}
	// Optional: For storing different skill sets for different resume versions
	// version: {
	// 	type: String,
	// 	default: "default"
	// }
}, {
	timestamps: true
});

// Indexes for better query performance
// skillsSchema.index({ userId: 1, version: 1 });
// skillsSchema.index({ "skills.category": 1 });

// Optional: Virtual for calculating total skills count
skillsSchema.virtual("totalSkills").get(function() {
	return this.skills.length; 
});

// Optional: Method to get skills by category
skillsSchema.methods.getSkillsByCategory = function(category) {
	return this.skills.filter(skill => skill.category === category);
};

// Optional: Method to get featured skills
skillsSchema.methods.getFeaturedSkills = function() {
	return this.skills.filter(skill => skill.featured);
};
