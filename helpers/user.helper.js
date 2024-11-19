export const checkResumeExistsInUser = (resumeId, user) => {
	return user.resumes.find((resume) => resume.resume.toString() === resumeId.toString());
};

export const checkPersonaExistsInUser = (personaId, user) => {
	return user.personas.find((persona) => persona.toString() === personaId.toString());
};
