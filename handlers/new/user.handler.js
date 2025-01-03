import USER from "../../models/User.js";
import expressAsyncHandler from "express-async-handler";

/*
    function this contains : 
    create => in frontend (NextAuth.js)
    get => user ( first name ,lastname , email ,phone)
    update  =>  profile.firstname , profile.lastname, profile.phone , password 
    delete => delete user 
    forget password (not implemented yet)
 */

// Without try - catch
export const updateUserHandler = expressAsyncHandler(async (userId, updatedData) => {

	const {firstName,lastName,email,phone } = updatedData;
    
	const updates = {};

	// adding fields to the updates object only if they are not null or undefined
	if (firstName !== null && firstName !== undefined ) {updates["profile.firstName"] = firstName;}
	if (lastName !== null && lastName !== undefined) {updates["profile.lastName"] = lastName;}
	if (phone !== null && phone !== undefined) {updates["profile.phone"] = phone;}
	if (email !== null && email !== undefined) {updates.email = email;}

	  // Find the user by ID
	const user = await USER.findByIdAndUpdate(userId, {$set : updates}, { new : true } );
  
	if (!user) { // this will happen if document with that id is not found
		return { success: false, error: "User not found" };
	}

	return { success: true, error: null ,data:user };
});

export const deleteUserHandler = expressAsyncHandler( async (userId) => {

	const user = await USER.findByIdAndDelete(userId);

	if (!user) {
		return { success: false, error: "User not found" };
	}

	return { success: true };
});

export const getUserProfileHandler = expressAsyncHandler( async (userId) => {
	
	const user = await USER.findById(userId);

	if (user) {

		const userObj = user.toObject(); //for plain javascript keys , without hte mongoose internal jazz
		const { profile : {firstName,lastName,phone} , email } = userObj;

		return { success: true, user : {firstName,lastName,phone,email} };
	}

	return { success: false, error: "User not found" };
});
