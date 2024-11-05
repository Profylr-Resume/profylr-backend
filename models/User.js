import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	resume:[
		{
			type:Schema.Types.ObjectId, 
			ref:"RESUME"
		}
	]
}); 

const USER = mongoose.model("User",userSchema);

export default USER;