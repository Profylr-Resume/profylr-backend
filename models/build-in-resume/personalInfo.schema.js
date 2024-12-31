import { Schema } from "mongoose";

export const personaInfoSchema = new Schema({
	name:String,
	github:String,
	linkedIn:String,
	email:String,
	phoneNumber:String
},{timestamps:true});
