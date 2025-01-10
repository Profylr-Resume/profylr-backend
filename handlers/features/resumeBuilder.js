import expressAsyncHandler from "express-async-handler";
import ApiError from "../../utils/errorHandlers";
import { createBuildInResumeHandler } from "../modelConnection/buildInResume.handler";
import { createImportedResumeHandler } from "../modelConnection/importedResume.handler";
import { createResumeHandler } from "../modelConnection/resume.handler";
import { createResumeTimeline } from "../modelConnection/resumeTimeline.handler";


export const createResume = expressAsyncHandler( async({data,userId})=>{

	/** Flow :
    1. build In resume / Imported Resume 
    2. Resume 
    3. Resume Timeline
    **/

	// i need to get everything from data;
	// object ID required : userId ,{ personaId, templateId}
	const {title,description,isImported, resumeData, resumeType, status , tags ,starred }= data;

	let savedResume ;

	// 1. create BuildIn/ Imported Resume
	switch (resumeType) {
	case "BuiltInResume":{
		 savedResume = await createBuildInResumeHandler(resumeData);  
		break;}
	case "ImportedResume":{
		// here need to add teh logic for stroing the resume in object storage first. PENDING
		savedResume = await createImportedResumeHandler(resumeData);
		break;}
	default:
		throw new ApiError(400, "Resume type is not valid.");
	}
    

	if(savedResume.success){
		// 2. Create Resume
		
		const resumeRes = await createResumeHandler({
			user:userId,
			title,
			description,
			isImported,
			resumeData:savedResume.data._id,
			resumeType,
			status,
			tags,
			starred
		});
		
		
		if(resumeRes.success){
			// 3. Create resume timeline

			// const resumeTimelineRes = await createResumeTimeline({

			// })
		}

		return {success :true , data : resumeRes};
	}
	throw new ApiError(403,"Build In resume or Imported resume instance is not yet created");
});
 
const updateResume = expressAsyncHandler(async({updatedData,userId})=>{

	const {title,description,isImported, resumeData, resumeType, status , tags ,starred }= updatedData;

	if(resumeData){
		switch (resumeType) {
		case "BuiltInResume":{
			const resumeUpdated = await createBuildInResumeHandler(resumeData);  
			break;}
		case "ImportedResume":{
			// here need to add teh logic for stroing the resume in object storage first. PENDING
			const resumeUpdated = await createImportedResumeHandler(resumeData);
			break;}
		default:
			throw new ApiError(400, "Resume type is not valid.");
		}
	}

});