import { Schema } from "mongoose";

export const basicInfoSchema = new Schema({
	name:String,
	github:String,
	linkedIn:String,
	email:String,
	phoneNumber:String
},{timestamps:true});
