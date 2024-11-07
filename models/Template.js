import mongoose, { Schema } from "mongoose";


const templateSchema = new Schema({
	name:String,
	description:String,
	html:String,
	sections:[{
		section:{
			type:Schema.Types.ObjectId,
			ref:"ResumeSection"
		},
		html:{
			type:String,
			required:true
		}
	}]
});

const TEMPLATE = mongoose.model("Template",templateSchema);

export default TEMPLATE;