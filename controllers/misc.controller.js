import { personalizedTemplatesHandler } from "../handlers/misc.handler";
import { missingFieldsError } from "../utils/errors.utils";
import { eventExecutedSuccessfully } from "../utils/success.utils";


export const getPersonalizedTemplateStructure = async (req,res)=>{

	const { success, error, personalizedTemplates } = await personalizedTemplatesHandler(req.body);

	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, personalizedTemplates, "Created personalized templates successfully");

};