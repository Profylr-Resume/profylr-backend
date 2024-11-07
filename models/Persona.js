import mongoose, { Schema } from "mongoose";


const personaSchema = new Schema({
	experienceLevel:{
		type:String,
		required:true,
		enum:[
			"fresher", "intermediate", "experienced"
		]
	},
	targetRole:{
		type:String,
		required:true
	},
	background: {
		yearsOfExperience: {
			type:Number,
			required:true
		},
		education: {
			level:{
				type:String,
				enum:[
					"graduated",
					"inCollege",
					"postGraduate"
				],
				required:true
			}
		},
		hasProjects: {
			type:Boolean,
			required:true
		},
		hasCertifications: {
			type:Boolean,
			required:true
		},
		industries: [String]
	},
	strengths: [String],
	goals: [String]
});

const PERSONA = mongoose.model("Persona",personaSchema);

export default PERSONA;