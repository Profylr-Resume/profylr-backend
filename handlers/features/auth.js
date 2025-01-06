import expressAsyncHandler from "express-async-handler";
import { createUserHandler, getUserByCredentialHandler } from "../modelConnection/user.handler.js";
import { generateToken } from "../../utils/token.utils.js";
import ApiError from "../../utils/errorHandlers.js";


export const registerUser = expressAsyncHandler(async(data)=>{
    
	const {firstName , lastName , email , password} = data;

	const userCreatedRes = await createUserHandler({profile:{firstName,lastName},email,password});

	if(userCreatedRes.success){
		const jwt = generateToken({email , id : userCreatedRes._id});

		if(jwt){
			const {profile: {firstName, lastName}, email } = userCreatedRes.data;
			return {success:true , data :{firstName,lastName,email,jwt}};
		}

		throw new ApiError(500,"jwt creation failed..");
	}

	throw new ApiError(500,"Error creating user in registerUser.");
});

export const loginUser = expressAsyncHandler(async(data)=>{
    
	const { email , password }= data;


	const user = await getUserByCredentialHandler({email,password});

	if(user.success){
		const jwt = generateToken({email , id : user._id});

		if(jwt){
			const {firstName, lastName, email } = user.data;
			return {success:true , data :{firstName,lastName,email,jwt}};
		}

		throw new ApiError(500,"jwt creation failed..");
	}

	throw new ApiError(500,"Failed to login user.");

});