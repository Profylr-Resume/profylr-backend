import mongoose, { Schema } from "mongoose";
import {basicInfoSchema} from "./BasicInfo";
import { educationSchema } from "./Education";
import { experiencesSchema } from "./Experience";
import { skillsSchema } from "./Skills";
import { projectsSchema } from "./Projects";


const resumeFormSchema = new Schema({
	basicInfo:basicInfoSchema,
	education:educationSchema,
	skills:skillsSchema,
	projects:projectsSchema,
	experience:experiencesSchema
});


const ResumeForm = mongoose.model("RESUME",resumeFormSchema);

export default ResumeForm;