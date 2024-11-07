import expressAsyncHandler from "express-async-handler";
import PERSONA from "../models/Persona.js";
import personaValidation from "../validations/persona.validate.js";
import sanitizer from "sanitizer";
import { missingFieldsError, notFoundError } from "../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../utils/success.utils.js";

const { sanitize } = sanitizer;

export const createPersona = expressAsyncHandler(async (req, res) => {

	// Sanitize the input data
	const sanitizedData = sanitize(req.body);
  
	// Validate the sanitized data
	const { error, value } = personaValidation.validate(sanitizedData);

	if (error) {
		return missingFieldsError(res,error);
	}
  
	// Create and save the new Persona document
	const newPersona = await PERSONA.create(value);
  
	return eventExecutedSuccessfully(res,newPersona,"New persona created successfully");
});


export const deletePersona = expressAsyncHandler(async(req,res)=>{
    
	const personaId = req.params.id;

	if(!personaId){
		return missingFieldsError(res);
	}
    
	const deletedPersona = await PERSONA.findOneAndDelete(personaId) ;

	if(!deletedPersona){
		return notFoundError(res,"Persona",["Id"]);
	}

	return eventExecutedSuccessfully(res,deletedPersona,"Persona deleted successfully");
});