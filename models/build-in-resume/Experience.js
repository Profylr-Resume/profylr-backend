import { Schema } from "mongoose";

export const experienceSchema = new Schema({
	organisationName:String,
	position:String,
	from:String,
	to:String,
	description:[String]
},{timestamps:true});


