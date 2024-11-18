import mongoose, { Schema } from "mongoose";

// need to store the ideal resume struture with each persona.
// coz every unique persona will have that same ideal structure everytime.
// we will just dont show it to the user


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
	goals: [String],
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