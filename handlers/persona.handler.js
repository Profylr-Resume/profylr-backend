import sanitizer from "sanitizer";
import personaValidation from "../validations/persona.validate";
import PERSONA from "../models/Persona";

const { sanitize } = sanitizer;

export const createPersonaHandler = async (data) => {
	// Sanitize the input data
	const sanitizedData = sanitize(data);

	// Validate the sanitized data
	const { error, value } = personaValidation.validate(sanitizedData);

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
