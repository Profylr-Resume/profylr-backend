import mongoose, { Schema } from "mongoose";
import AUDIT_LOG from "./AuditLog.js";

// need to store the ideal resume struture with each persona.
// coz every unique persona will have that same ideal structure everytime.
// we will just dont show it to the user

const PersonaSchema = new Schema({
	
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
		],
		required: true
	},

	goals: {
		type: [String],
		enum: [
			"Career Transition", "Industry Switch", "Senior Position",
			"Research Opportunity", "First Job", "Leadership Role"
		],
		required: true
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

// For now i am not providing functionality to update persona
PersonaSchema.pre("findOneAndUpdate",async function(next){

	// this.model => this gets the current model the hook is workng on 
	// this.getQuery() => gets the query that is under process for which the hook is being initialized

	const originalDoc = await this.model.findOne(this.getQuery());
	this.set("__original",originalDoc); //temporarily storing the original doc.
	next();
});

PersonaSchema.post("findOneAndUpdate",async function (doc){

	const originalDoc = this.get("__original");

	if(originalDoc){
		const changes = [];
		for (const key in originalDoc.toObject() ){
			if(originalDoc[key] !== doc[key] ){
				changes.push({
					field:key,
					oldValue: originalDoc[key],
					newValue: doc[key]
				});
			}
		}

		await AUDIT_LOG.create({
			changes,
			documentId: doc._id,
			collectionName: "Persona"
		});

	}
});

const PERSONA = mongoose.model("Persona",PersonaSchema);

export default PERSONA;