

export const checkPersonaExistsInUser =(persona,user)=>{
	return user.personas.find(p=>p===persona._id);
};