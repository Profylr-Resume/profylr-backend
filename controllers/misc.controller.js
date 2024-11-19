import { personalizedTemplatesHandler } from "../handlers/personalizedTemplates.handler.js";
import { missingFieldsError, notFoundError } from "../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../utils/success.utils.js";


export const getPersonalizedTemplates = async (req,res)=>{

	const userId = req.user._id;

	if(!userId){
		return notFoundError(res,"User Id",["id in jwt"]);
	}

	const { success, error, personalizedTemplates } = await personalizedTemplatesHandler(req.body,userId);
    
	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, personalizedTemplates, "Created personalized templates successfully");

};