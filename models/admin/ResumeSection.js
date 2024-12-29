import mongoose, { Schema } from "mongoose";

// id will automatically be generated
const sectionSchema = new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	categories:[String], // "Engineering, Medicne , Finance etc.."
	departments:[String], // computer, civil ,electrical , CA etc...
	description:String

});

// categories and description will behave as tags .
//  so when a user selects a template it will have all the sections falling in that category and department


const RESUME_SECTION = mongoose.model("ResumeSection",sectionSchema);

export default RESUME_SECTION;