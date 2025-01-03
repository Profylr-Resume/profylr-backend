import RESUME_VERSION_MANAGER from "../../models/ResumeTimeline";
import ApiError from "../../utils/errorHandlers";
import { validateIncomingData } from "../../utils/validations";
import { validateResumeTimelineForCreation, validateResumeTimelineForUpdate } from "../../validations/resumeTimeline.validate";

// create
export const createResumeTimeline = async(data)=>{  

	const values =validateIncomingData(validateResumeTimelineForCreation,data);

	const resumeTimeline = await RESUME_VERSION_MANAGER.create(values);

	return {success: true , data : resumeTimeline};
}; 

// update
export const updateResumeTimeline = async(id , updatedData)=>{

	if(!id){
		throw new ApiError(400, "No resume timeline id given for updation");
	}

	const values = validateIncomingData(validateResumeTimelineForUpdate ,updatedData);

	const resumeTimeline = await RESUME_VERSION_MANAGER.findByIdAndUpdate(id,{$set : values}, {new : true});

	if(!resumeTimeline){
		throw new ApiError(404,"Resume timeline not found with the given id.");
	}

	return {success: true , data : resumeTimeline};
};

// delete
export const deleteResumeTimeline = async (id)=>{

	if(!id){
		throw new ApiError(400, "No resume timeline id given for deletion");
	}

	const resumeTimeline = await RESUME_VERSION_MANAGER.findByIdAndDelete(id);

	if(!resumeTimeline){
		throw new ApiError(404,"Resume timeline not found with the given id or unable to delete the given resume timeline .");
	}

	return {success: true, data : resumeTimeline};
};

// GET by Id
export const getResumeTimelineById = async(id)=>{

	if(!id){
		throw new ApiError(400, "No resume timeline id given for deletion");
	}

	const resumeTimeline = await RESUME_VERSION_MANAGER.findById(id);

	if(!resumeTimeline){
		throw new ApiError(404,"Resume timeline not found with the given id.");
	}

	return {success:true , data : resumeTimeline};
};

// GET filters
export const getResumeTimeline = async({})=>{
    

};