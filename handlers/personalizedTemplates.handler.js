import expressAsyncHandler from "express-async-handler";
import { filterTemplatesWithRecommendations, handleGenerateRecommendations, handleRetrieveAllTemplates } from "../helpers/personalizedTemplates.helper.js";
import personaValidation from "../validations/persona.validate.js";
import PERSONA from "../models/Persona.js";
import { checkPersonaExistsInUser } from "../helpers/persona.helper.js";
import { updateUserHandler } from "./user.handler.js";
import { createPersonaHandler, updatePersonaHandler } from "./persona.handler.js";
import USER from "../models/User.js";

// create and attach persona to the user
export const analyzingPersonaInUser = expressAsyncHandler(async(data,userId)=>{

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

	// Extract only the fields i need to match
	const { experienceLevel, targetRole, background, strengths, goals } = value;

	// Building a query for  matching
	const query = {
		experienceLevel,
		targetRole,
		"background.yearsOfExperience": background.yearsOfExperience,
		"background.education.level": background.education.level,
		"background.hasProjects": background.hasProjects,
		"background.hasCertifications": background.hasCertifications,
		strengths,
		goals
	};

	// CASE 1 : Persona already  exist.
	const existingPersona = await PERSONA.findOne(query);
	console.log(existingPersona);
	const savedUser = await USER.findById(userId);

	if(!savedUser){
		return {success:false, error:"Saved User not found"};
	}

	// case 1:
	if(existingPersona){

		// sub-case 1
		const resumeIdIfPersonaAlreadyExists = await checkPersonaExistsInUser(existingPersona,savedUser);

		// sub-case 2
		if(!resumeIdIfPersonaAlreadyExists){
			
		   // Create a new resume object with the existing persona
			const newResume = { persona: existingPersona._id };

			// Call the update handler to add the new resume
			const { success, addedResume, error: updateError } = await updateUserHandler(savedUser._id, newResume);

			if (!success) {
				return { success: false, error: updateError || "Failed to update user with existing persona" };
			}
			return { success:true, existingPersona ,userResumeId: addedResume._id };

		}
     
		return { success:true, existingPersona ,userResumeId: resumeIdIfPersonaAlreadyExists };
	}

	// case 2 : Creating new persona and adding in user
	const {success:newPersonaSuccess, newPersona ,error:newPersonaError} = await createPersonaHandler(value);

	if (!newPersonaSuccess || !newPersona || !newPersona._id) {
		return { success: false, error: newPersonaError || "Failed to create new persona" };
	}

	// Create a new resume object with the existing persona
	const newResume = { persona: newPersona._id };
	// Call the update handler to add the new resume
	const { success:userUpdateSuccess, addedResume, error: userUpdateError } = await updateUserHandler(savedUser._id, newResume);
    
	console.log(addedResume.toObject());

	if (!userUpdateSuccess) {
		return { success: false, error: userUpdateError || "Failed to update user with new persona" };
	}

	return {success:true,newPersona,userResumeId:addedResume._id};
}); 

/**
 * Generates personalized template recommendations based on user's input data.
 * @param {Object} data - The input data representing the user's persona.
 * @returns {Object} - An object containing the recommended template sections, content advice, and reasoning.
 */

const getPersonaWithTemplateStructure = async (data,userId) => {

	// Step 1: Attaching persona with user if not already
	const { success: personaSuccess, error: getPersonaError, newPersona , existingPersona,userResumeId } = await analyzingPersonaInUser(data,userId);
	
	if (!personaSuccess) {
		return { success: false, error: getPersonaError };
	}

	// if persona already exitis then it does not need template strucure because it would already be with that.
	if (existingPersona) {
		return { success: true, persona: existingPersona,userResumeId };
	}

	// (only to update teh persona structure , nothing to do with user. Persona is already attched with user)
	//   ONLY MOVING DOWN IF TO CREATE & ATTACH TEMPLATE STRCUTURE WITH PERSONA------------------------------------ 

	// Step 2: Generate Recommendations
	const { success: recommendationSuccess, recommendations, error: recommendationError } = await handleGenerateRecommendations(newPersona);
	if (!recommendationSuccess) {
		return { success: false, error: recommendationError };
	}

	// Step 3: Update Persona with Template Structure
	const { success: updatedPersonaSuccess, updatedPersona, error: updatedPersonaError } = await updatePersonaHandler(newPersona._id, {
		templateStructure: recommendations
	});
	if (!updatedPersonaSuccess) {
		return { success: false, error: updatedPersonaError };
	}

	return { success: true, persona: updatedPersona ,userResumeId};
};


/**
 * Retrieves personalized templates based on the user's input data.
 * @param {Object} data - The input data representing the user's persona.
 * @returns {Object} - An object containing the personalized templates.
 */

export const personalizedTemplatesHandler = async (data,userId) => {

	// Step 1: Generate personalized  templateStructure
	const {success:templateStructureSuccess,persona:{ templateStructure },error :templateStructureError ,userResumeId } = await getPersonaWithTemplateStructure(data,userId);

	if (!templateStructureSuccess) {
		return { success: false, error: templateStructureError };
	}

	// Step 2: Retrieve all available templates
	const { success: allTemplatesSuccess, allTemplates, error: allTemplatesError } = await handleRetrieveAllTemplates();
	if (!allTemplatesSuccess) {
		return { success: false, error: allTemplatesError };
	}

	// Step 3: Filter templates based on templateStructure
	const personalizedTemplates = await filterTemplatesWithRecommendations(allTemplates, templateStructure);

	return { success: true, personalizedTemplates ,userResumeId };
};


// const recommendations = engine.generateRecommendations({
// 	experienceLevel: "Entry",
// 	targetRole: "Software Engineer",
// 	background: {
// 		yearsOfExperience: 0,
// 		educationLevel: "Bachelors",
// 		hasProjects: true,
// 		hasCertifications: false,
// 		industries: ["Technology"]
// 	},
// 	strengths: ["Technical Skills", "Project Experience"],
// 	goals: ["First Job"]
// });
