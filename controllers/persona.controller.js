import expressAsyncHandler from "express-async-handler";
import { createPersonaHandler } from "../handlers/modelConnection/persona.handler.js";
import ApiResponse from "../utils/responseHandlers.js";


export const createPersona = expressAsyncHandler(async(req,res)=>{
    
	const personaRes = await createPersonaHandler(req.body);
    
	if(personaRes.success){
		ApiResponse.success(res,"Persona created successfully",personaRes,201); 
	}
});