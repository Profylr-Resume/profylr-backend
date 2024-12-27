import mongoose, { Schema } from "mongoose";
import {basicInfoSchema} from "./build-in-resume/BasicInfo.js";
import { educationSchema } from "./build-in-resume/Education.js";
import { experienceSchema } from "./build-in-resume/Experience.js";
import { skillSchema } from "./build-in-resume/Skills.js";
import { projectSchema } from "./build-in-resume/Projects.js";


const BuildInResumeSchema = new Schema({

	basicInfo:basicInfoSchema,
	education:educationSchema,
	skills:[skillSchema],
	projects: [projectSchema],
	experiences:[experienceSchema],
	persona : {
		type:mongoose.Schema.Types.ObjectId,
		ref:"Persona"
	},
	template:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Template"
	}
},{
	timestamps:true
});


const BUILD_IN_RESUME = mongoose.model("BuildInResume",BuildInResumeSchema);

export default BUILD_IN_RESUME;