import expressAsyncHandler from "express-async-handler";
import { validateIncomingData } from "../../utils/validations";
import { validateUserForCreation } from "../../validations/user.validate";
import USER from "../../models/User";

export const registerUser = expressAsyncHandler(async(data)=>{

	const values = validateIncomingData(validateUserForCreation,data);

	const user = await USER.create(values);

	return {success:true , data : user};
});

export const loginUser = expressAsyncHandler(async(data)=>{

    
});

export const loginViaToken = expressAsyncHandler(async(data)=>{

    
});