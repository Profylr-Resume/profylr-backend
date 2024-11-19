import personaValidation from "../validations/persona.validate.js";
import PERSONA from "../models/Persona.js";
import USER from "../models/User.js";
import { checkPersonaExistsInUser } from "../helpers/persona.helper.js";
import { updateUserHandler } from "./user.handler.js";
import expressAsyncHandler from "express-async-handler";

export const getPersonaHandler = expressAsyncHandler( async(data,userId)=>{

	/*
    things to take care of :
    case 1. New persona.
             saved in PERSONA .
             refered to the personas of user
    Case 2: Existing persona
        Sub-case 1 : Persona exists in PERSONA module but not in personas of user.
        sub-case 2 : Persona exists in PERSONA module and the personas of user.         
    
   
    */

	// Validate the sanitized data
	const { error, value } = personaValidation.validate(data);

	if (error) {
		return { success: false, error };
	}

	// CASE 1 : Persona already  exist.
	const existingObject = await PERSONA.findOne(value);
	const savedUser = await USER.findById(userId);

	if(!savedUser){
		return {success:false, error:"Saved USer not found"};
	}

	// case 1:
	if(existingObject){

		// sub-case 1
		const isPersonaAlreadyInUser = checkPersonaExistsInUser(existingObject,savedUser);

		// sub-case 2
		if(!isPersonaAlreadyInUser){
			
		  // Add existing persona to user's personas
			const { success, error: updateError } = await updateUserHandler(savedUser._id, {
				personas: [...new Set([...savedUser.personas, existingObject._id])]
			});

			if (!success) {
				return { success: false, error: updateError || "Failed to update user with existing persona" };
			}
		}
     
		return { success: true, persona:existingObject };
	}

	// case 2 : Creating new persona and adding in user
	const {success:newPersonaSuccess, newPersona ,error:newPersonaError} = await createPersonaHandler(value);

	if (!newPersonaSuccess || !newPersona || !newPersona._id) {
		return { success: false, error: newPersonaError || "Failed to create new persona" };
	}

	 // Add newly created persona to user's personas
	const { success: userUpdateSuccess, error: userUpdateError } = await updateUserHandler(userId, {
		personas: [...new Set([...savedUser.personas, newPersona._id])]
	});
    
	if (!userUpdateSuccess) {
		return { success: false, error: userUpdateError || "Failed to update user with new persona" };
	}

	return {success:true,persona:newPersona};
}); 


export const createPersonaHandler = async (data) => {

	// Validate the sanitized data
	const { error, value } = personaValidation.validate(data);

	if (error) {
		return { success: false, error };
	}

	// Create and save the new Persona document
	const newPersona = await PERSONA.create(value);

	return { success: true, newPersona };
};

export const updatePersonaHandler = async (id, data) => {
	try {
		// Validate the sanitized data
		const { error, value } = personaValidation.validate(data);

		if (error) {
			return { success: false, error };
		}

		// Find the persona by ID and update it
		const updatedPersona = await PERSONA.findByIdAndUpdate(id, value, { new: true });

		if (!updatedPersona) {
			return { success: false, error: "Persona not found" };
		}

		return { success: true, updatedPersona };
	} catch (err) {
		return { success: false, error: err.message };
	}
};

export const deletePersonaHandler = async (personaId) => {
	if (!personaId) {
		return { success: false, error: "Missing persona ID" };
	}

	const deletedPersona = await PERSONA.findOneAndDelete({ _id: personaId });

	if (!deletedPersona) {
		return { success: false, error: "Persona not found" };
	}

	return { success: true, deletedPersona };
};
