import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import AUDIT_LOG from "./AuditLog";

const userSchema = new Schema({
	
	profile: {
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phone: String
	  },
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	  },

	meta: {
		lastLogin: Date,
		registrationDate: { type: Date, default: Date.now },
		isVerified: { type: Boolean, default: false },
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

userSchema.pre("findOneAndUpdate" , async function(next){

	const originalDoc = await this.model(this.getQuery());
	this.set("__originalDoc",originalDoc);

	next();
});

userSchema.post("findOneAndUpdate",async function(updatedDocAfterQuery){

	const originalDoc = this.get("__originalDoc");

	if(originalDoc){
		const changes = [];
		for (const key in originalDoc.toObject()){
			if(originalDoc[key] !== updatedDocAfterQuery[key]){
				changes.push({
					field:key,
					oldValue : originalDoc[key],
					newValue : updatedDocAfterQuery[key]
				});
			}
		}

		await AUDIT_LOG.create({
			changes,
			documentId: updatedDocAfterQuery._id,
			collectionName:"User"
		});
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