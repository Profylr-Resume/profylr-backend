import sanitizer from "sanitizer";
import personaValidation from "../validations/persona.validate.js";
import PERSONA from "../models/Persona.js";


export const createPersonaHandler = async (data) => {

	// Validate the sanitized data
	const { error, value } = personaValidation.validate(data);

	if (error) {
		return { success: false, error };
	}

	
	const existingObject = await PERSONA.findOne(value);
	
	if(existingObject){
		return { success: true, existingObject };
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
