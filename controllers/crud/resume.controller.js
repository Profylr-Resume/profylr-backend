import { createResumeHandler } from "../../handlers/resume.handler";
import { missingFieldsError } from "../../utils/errors.utils";


export const createResume = async(req,res)=>{

	const userId = req?.user?._id;
	if(!userId){
		return missingFieldsError(res,"did not recieved user id while creating resume");
	}

	const {success,error,savedResume} = await createResumeHandler(req.body);

	if(!success){
		return missingFieldsError(res, error);
	}

};

export const updateResume = (req,res)=>{

};

export const deleteResume = (req,res)=>{
	
};

export const allResume = (req,res)=>{
	
};

export const oneResume = (req,res)=>{

};