// import expressAsyncHandler from "express-async-handler";
// import { missingFieldsError, notFoundError } from "../../utils/errors.utils.js";
// import { eventExecutedSuccessfully } from "../../utils/success.utils.js";
// import { createPersonaHandler, deletePersonaHandler } from "../../handlers/new/persona.handler.js";


// export const createPersona = expressAsyncHandler(async (req, res) => {
// 	const userId = req.user._id;
// 	const { success, error, newPersona } = await createPersonaHandler(req.body,userId);

// 	if (!success) {
// 		return missingFieldsError(res, error);
// 	}

// 	return eventExecutedSuccessfully(res, newPersona, "New persona created successfully");
// });

// export const deletePersona = expressAsyncHandler(async (req, res) => {
// 	const personaId = req.params.id;
// 	const { success, error, deletedPersona } = await deletePersonaHandler(personaId);

// 	if (!success) {
// 		if (error === "Missing persona ID") {
// 			return missingFieldsError(res);
// 		}
// 		return notFoundError(res, "Persona", ["Id"]);
// 	}

// 	return eventExecutedSuccessfully(res, deletedPersona, "Persona deleted successfully");
// });
