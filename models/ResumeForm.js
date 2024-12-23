import mongoose, { Schema } from "mongoose";
import {basicInfoSchema} from "./resumeForm/BasicInfo.js";
import { educationSchema } from "./resumeForm/Education.js";
import { experienceSchema } from "./resumeForm/Experience.js";
import { skillSchema } from "./resumeForm/Skills.js";
import { projectSchema } from "./resumeForm/Projects.js";


const resumeFormSchema = new Schema({
	basicInfo:basicInfoSchema,
	education:educationSchema,
	skills:[skillSchema],
	projects: [projectSchema],
	experiences:[experienceSchema],
	path:{
		originalName:{
			type:String,
			required:true
		},
		mimeType:{
			type:String,
			required:true
		},
		base64:{
			type:String,
			required:true
		}
	}
});


const RESUME = mongoose.model("Resume",resumeFormSchema);

export default RESUME;