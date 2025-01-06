import expressAsyncHandler from "express-async-handler";
import { loginUser, registerUser } from "../handlers/features/auth.js";
import ApiResponse from "../utils/responseHandlers.js";
import ApiError from "../utils/errorHandlers.js";

// Register User
export const registerUserController = expressAsyncHandler( async (req, res) => {
	
	const user = await registerUser(req.body);

	if(user.success){
		ApiResponse.success(res,"User created successfully.",user.data,201);
	}

});

// Login User
export const loginUserController = expressAsyncHandler(async (req, res) => {

	const user = await loginUser(req.body);

	if(user.success){
		ApiResponse.success(res,"User logged in successfully.",user.data,200);
	}
	
});


