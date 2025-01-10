import USER from "../../models/User.js";
import expressAsyncHandler from "express-async-handler";
import { validateIncomingData } from "../../utils/validations.js";
import { validateUserForCreation, validateUserForUpdate } from "../../validations/user.validate.js";
import ApiError from "../../utils/errorHandlers.js";

/*
    function this contains : 
    create => in frontend (NextAuth.js)
    get => user ( first name ,lastname , email ,phone)
    update  =>  profile.firstname , profile.lastname, profile.phone , password 
    delete => delete user 
    forget password (not implemented yet)
 */

export const createUserHandler = expressAsyncHandler(async(data)=>{
	
	const values = validateIncomingData(validateUserForCreation() ,data);
	
	const user = await USER.create(values);
	
	return {success:true , data : user};
});

export const updateUserHandler = expressAsyncHandler(async (id, updatedData) => {

	if(!id){
		throw new ApiError(400, "No user id given for updation");
	}

	const values = validateIncomingData(validateUserForUpdate, updatedData);

	const user = await USER.findByIdAndUpdate(id, {$set : values}, { new : true } );
  
	if(!user){
		throw new ApiError(404,"User not found with the given id.");
	}

	return { success: true ,data:user };
});

export const deleteUserHandler = expressAsyncHandler( async (id) => {

	if(!id){
		throw new ApiError(400, "No user id given for updation");
	}

	const user = await USER.findByIdAndDelete(id);

	if(!user){
		throw new ApiError(404,"User not found with the given id and unable to delete the user.");
	}

	return { success: true , data : user };
});

export const getUserByIdHandler = expressAsyncHandler( async (id) => {
	
	if(!id){
		throw new ApiError(400, "No user id given to get the user");
	}

	const user = await USER.findById(id);

	if(!user){
		throw new ApiError(404,"User not found with the given id.");
	}

	return { success: false, data  : user};
});


// GET by filters
export const getUserByCredentialHandler = expressAsyncHandler( async({email,password})=>{
	
	if(!email){
		throw new ApiError(400,"Email not found");
	}
	const user = await USER.findOne({"email":{$eq : email}});

	if(!user){
		throw new ApiError(404,"No user found with given email.");
	}

	const isPasswordMatched = await user.comparePassword(password);

	if(!isPasswordMatched){
		throw new ApiError(404, "Wrong password.");
	}
	else{
		return {success :true , data :user};
	}
});