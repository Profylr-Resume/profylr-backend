import mongoose, { Schema } from "mongoose";
import {basicInfoSchema} from "./resumeForm/BasicInfo";
import { educationSchema } from "./resumeForm/Education";
import { experiencesSchema } from "./resumeForm/Experience";
import { skillsSchema } from "./resumeForm/Skills";
import { projectsSchema } from "./resumeForm/Projects";


const resumeFormSchema = new Schema({
	basicInfo:basicInfoSchema,
	education:educationSchema,
	skills:skillsSchema,
	projects:projectsSchema,
	experience:experiencesSchema
});


const RESUME = mongoose.model("Resume",resumeFormSchema);

export default RESUME;