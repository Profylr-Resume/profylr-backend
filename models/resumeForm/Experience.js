import { Schema } from "mongoose";

const experienceSchema = new Schema({
	organisationName:String,
	position:String,
	from:String,
	to:String,
	description:[String]
});

export const experiencesSchema = new Schema({
	experiences: [experienceSchema]
},
{timestamps:true}
);

