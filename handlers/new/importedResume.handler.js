import { validateIncomingData } from "../../utils/validations";
import { validateImportedResumeForCreation, validateImportedResumeForUpdate } from "../../validations/importedResume.validate";
import IMPORTED_RESUME from "../../models/ImportedResume.js";
import ApiError from "../../utils/errorHandlers.js";

export const createImportedResume = async(data)=>{
    
	const values = validateIncomingData(validateImportedResumeForCreation,data);

	const resume = await IMPORTED_RESUME.create(values);

	return {success:true , data : resume};

};

export const updateImportedResume = async (id,updatedData)=>{

	if(!id){
		throw new ApiError(400, "No imported Resume given for updation");
	}

	const values = validateIncomingData(validateImportedResumeForUpdate,updatedData);

	const resume = await IMPORTED_RESUME.findByIdAndUpdate(id,{$set : values}, {new : true});

	if(!resume){
		throw new ApiError(404,"Imported resume not found with the given id.");
	}

	return {success: true , data : resume};
};

export const deleteImportedResume = async (id)=>{

	if(!id){
		throw new ApiError(400, "No imported Resume given for deletion");
	}

	const resume = await IMPORTED_RESUME.findByIdAndDelete(id);

	if(!resume){
		throw new ApiError(404,"No resume found with given imported resume id or unable to delete the given imported resume.");
	}

	return {success: true, data : resume};
};

export const getImportedResumeById = async(id)=>{

	if(!id){
		throw new ApiError(400, "No imported Resume given to get.");
	}

	const resume = await IMPORTED_RESUME.findById(id);

	if(!resume){
		throw new ApiError(404, "Error finding the imported resume with given id.");
	}

	return {success:true , data : resume};
};

export const getImportedResumeHandler = async({})=>{
    
    
};