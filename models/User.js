import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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
	resumes:[
		{
			resume:{
				type:Schema.Types.ObjectId, 
				ref:"RESUME"
			},
			template:{
				type:Schema.Types.ObjectId, 
				ref:"TEMPLATE"
			},
			meta: [
				{
				  field: {
						type: String
				  },
				  oldValue: {
						type: String
				  },
				  newValue: {
						type: String
				  }
				}
			  ]
			
		}
	]
}); 

/* The pre hook runs before the save event on the schema. 
 This allows you to apply custom logic every time a document 
 is saved, which is ideal for tasks like hashing a password.
 schema.post()
 post middleware runs after the document is saved or validated, 
 and it’s useful for logging, cleaning up, or triggering events after certain actions.
 */

userSchema.pre("save",async function(next){
	console.log(this);
	// isModified => it’s available automatically when you create a schema in Mongoose. 
	if(!this.isModified("password")) {return next();}

	try{
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password,salt);

		return next();
	}catch(err){
		return next(err);
	}
});

userSchema.methods.comparePassword = async function(enteredPassword){
	return await bcrypt.compare(enteredPassword,this.password);
};


const USER = mongoose.model("User",userSchema);

export default USER;

/*
    header , summary , experience, projects , education , skills, certifications, achievements , publications , research , volunteer
*/