import { Schema } from "mongoose";

export const educationSchema = new Schema({
	underGraduate:{
		instituteName:String,
		field:String,
		yearOfPassing:String,
		result:String
	},
	twelfthGrade:{
		instituteName:String,
		field:String,
		yearOfPassing:String,
		result:String
	},
	tenthGrade:{
		instituteName:String,
		yearOfPassing:String,
		result:String 
	}
},
{timestamps:true}
);
