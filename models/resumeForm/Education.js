import { Schema } from "mongoose";

export const educationSchema = new Schema({
	underGraduate:{
		instituteName:String,
		field:String,
		passingYear:String,
		result:String
	},
	twelethClass:{
		instituteName:String,
		field:String,
		passingYear:String,
		result:String
	},
	tenthClass:{
		instituteName:String,
		passingYear:String,
		result:String 
	}
},
{timestamps:true}
);
