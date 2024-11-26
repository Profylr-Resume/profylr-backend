import mongoose, { Schema } from "mongoose";

// need to store the ideal resume struture with each persona.
// coz every unique persona will have that same ideal structure everytime.
// we will just dont show it to the user


const personaSchema = new Schema({
	
	experienceLevel: {
		type: String,
		required: true,
		enum: ["fresher", "intermediate", "experienced"]
	},
	targetRole: {
		type: String,
		required: true,
		enum: [
			"Software Engineer", "Data Scientist", "DevOps Engineer",
			"Research Scientist", "Research Assistant", "PhD Candidate",
			"Product Manager", "Business Analyst", "Project Manager"
		]
	},
	background: {
		yearsOfExperience: {
			type: Number,
			required: true,
			min: 0,
			max: 10
		},
		education: {
			level: {
				type: String,
				enum: ["graduated", "inCollege", "postGraduate"],
				required: true
			}
		},
		hasProjects: {
			type: Boolean,
			required: true
		},
		hasCertifications: {
			type: Boolean,
			required: true
		},
		industries: {
			type: [String],
			enum: ["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Energy"]
		}
	},
	strengths: {
		type: [String],
		enum: [
			"Technical Skills", "Project Experience", "Academic Excellence",
			"Leadership", "Research Publications", "Industry Knowledge"
		]
	},
	goals: {
		type: [String],
		enum: [
			"Career Transition", "Industry Switch", "Senior Position",
			"Research Opportunity", "First Job", "Leadership Role"
		]
	},
	careerReadiness: {
		type: String,
		enum: ["Job-Ready", "Skill Enhancement", "Higher Education", "Entrepreneurial"]
	},
	technicalAmbition: {
		hasInternshipExperience: Boolean,
		openToRemoteWork: Boolean,
		interestedInStartupEcosystem: Boolean,
		willingToRelocate: Boolean
	},
	templateStructure:{
		sections:[{
			serial_number: Number,
			name: String,
			_id: String
		}],
		contentAdvice:[String],
		reasoning:[String]
	}
});

const PERSONA = mongoose.model("Persona",personaSchema);

export default PERSONA;