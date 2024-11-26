

export const checkPersonaExistsInUser = async (persona, user) => {
	// Ensure user is fully populated with the 'resumes' array and their respective 'persona'
	const populatedUser = await user.populate({
	  path: "resumes.persona", // Populating 'persona' in each 'resume'
	  select: "_id" // Only selecting the '_id' field to optimize performance
	});
  
	 // Find the resume that contains the persona
	 const matchingResume = populatedUser.resumes.find((resume) =>
		resume.persona && resume.persona._id.toString() === persona._id.toString()
	  );
	
	  // If a match is found, return its 'resume._id'
	  if (matchingResume) {
		return matchingResume._id; // The ID of the resume object
	  }
	
	  // If no match is found, return null
	  return null;
};
  
  