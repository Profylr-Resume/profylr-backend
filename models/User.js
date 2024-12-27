import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
	profile: {
		firstName: {
			type: String, 
			required: true 
		},
		lastName: { 
			type: String, 
			required: true
		},
		phone: String
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		immutable : true
	},
	password: {
		type: String,
		required: true
	},

	meta: { // only for backend purposes 
		lastLogin: Date,
		registrationDate: { 
			type: Date, 
			default: Date.now
		},
		isVerified: { 
			type: Boolean,
			default: false 
		},
		verificationToken: String,
		resetPasswordToken: String,
		resetPasswordExpires: Date
	}
	
},{
	timestamps:true
}); 

/* The pre hook runs before the save event on the schema. 
 This allows you to apply custom logic every time a document 
 is saved, which is ideal for tasks like hashing a password.
 schema.post()
 post middleware runs after the document is saved or validated, 
 and it’s useful for logging, cleaning up, or triggering events after certain actions.
 */

userSchema.pre("save",async function(next){
	
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