import { personalizedTemplatesHandler } from "../handlers/misc.handler.js";
import { missingFieldsError } from "../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../utils/success.utils.js";


export const getPersonalizedTemplateStructure = async (req,res)=>{

	const { success, error, personalizedTemplates } = await personalizedTemplatesHandler(req.body);

	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, personalizedTemplates, "Created personalized templates successfully");

};