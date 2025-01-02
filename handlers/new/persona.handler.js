import PERSONA from "../../models/Persona.js";
import expressAsyncHandler from "express-async-handler";
import { validatePersonaForCreation } from "../../validations/persona.validate.js";
import { validateIncomingData } from "../../utils/validations.js";


// create persona - add tempalte structure
//  get persona 
// update persona => cannnot update persona once created , recreate it if you want to do that
//  delete 

export const createPersonaHandler = expressAsyncHandler( async (data) => {

	const values = validateIncomingData(validatePersonaForCreation,data);

	// need to add template structure here.
	// ----------------LOGIC------------------


	// Create and save the new Persona document
	const newPersona = await PERSONA.create(values);

	return { success: true, newPersona };
});

export const getPersonaHandler = expressAsyncHandler( async (id)=>{

	if(!id){
		return { success: false, error:"Persona ID not found" };
	}

	const persona = PERSONA.findById(id);

	if(!persona){
		return { success: false, error:"Persona not found" };
	}

	return { success: true, persona };
});

export const deletePersonaHandler = expressAsyncHandler( async (personaId) => {

	if (!personaId) {
		return { success: false, error: "Missing persona ID" };
	}

	const deletedPersona = await PERSONA.findOneAndDelete({ _id: personaId });

	if (!deletedPersona) {
		return { success: false, error: "Persona not found" };
	}

	return { success: true, deletedPersona };
});

// NOW CREATE POSTMAN DOCUMENTATION FOR IT