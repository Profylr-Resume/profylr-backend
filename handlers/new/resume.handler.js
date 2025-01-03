import expressAsyncHandler from "express-async-handler";
import RESUME from "../../models/Resume";
import ApiError from "../../utils/errorHandlers";
import { validateIncomingData } from "../../utils/validations";
import { validateResumeForCreation, validateResumeForUpdate } from "../../validations/resume.validate";


// create
export const createResume = expressAsyncHandler(async(data)=>{  

	const values =validateIncomingData( validateResumeForCreation ,data);

	const resume = await RESUME.create(values);

	return {success: true , data : resume};
}); 

// update
export const updateResume = expressAsyncHandler(async(id , updatedData)=>{

	if(!id){
		throw new ApiError(400, "No resume id given for updation");
	}

	const values = validateIncomingData( validateResumeForUpdate ,updatedData);

	const resume = await RESUME.findByIdAndUpdate(id,{$set : values}, {new : true});

	if(!resume){
		throw new ApiError(404,"Resume not found with the given id.");
	}

	return {success: true , data : resume};
});

// delete
export const deleteResume = expressAsyncHandler(async (id)=>{

	if(!id){
		throw new ApiError(400, "No resume id given for deletion");
	}

	const resume = await RESUME.findByIdAndDelete(id);

	if(!resume){
		throw new ApiError(404,"Resume not found with the given id or unable to delete the given resume.");
	}

	return {success: true, data : resume};
});

// GET by Id
export const getResumeById = expressAsyncHandler(async(id)=>{

	if(!id){
		throw new ApiError(400, "No resume id given for deletion");
	}

	const resume = await RESUME.findById(id);

	if(!resume){
		throw new ApiError(404,"Resume not found with the given id.");
	}

	return {success:true , data : resume};
});

// GET filters
export const getResume = expressAsyncHandler(async({})=>{
    

});