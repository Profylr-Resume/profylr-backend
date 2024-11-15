import { createPersonaHandler } from "./persona.handler";


export const personalizedTemplateStruture = (data)=>{


	const res = createPersonaHandler(data);

	if(!res?.success){
		return {success:false,error:res.error};
	}

	const {newPersona} =res;
    
};