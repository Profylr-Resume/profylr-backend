import expressAsyncHandler from "express-async-handler";
import { createPersonaHandler } from "../modelConnection/persona.handler";
import ApiError from "../../utils/errorHandlers";

export const createPersona = expressAsyncHandler(async(data)=>{

	const persona = await createPersonaHandler(data);
	// need to respond only _id
	return {success:true, data : persona};
});

// will add up new handelrs in this according to the requirement