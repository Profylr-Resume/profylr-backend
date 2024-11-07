import mongoose, { Schema } from "mongoose";

// id will automatically be generated
const sectionSchema = new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	description:String

});

const RESUME_SECTION = mongoose.model("ResumeSection",sectionSchema);

export default RESUME_SECTION;