import sanitizer from "sanitizer";
import personaValidation from "../validations/persona.validate.js";
import PERSONA from "../models/Persona.js";

const { sanitize } = sanitizer;

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
