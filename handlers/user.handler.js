import bcrypt from "bcrypt";
import USER from "../models/User.js";
import expressAsyncHandler from "express-async-handler";

export const updateUserHandler = expressAsyncHandler(async (userId, newResume) => {
	try {
	  // Find the user by ID
	  const user = await USER.findById(userId);
  
	  if (!user) {
			return { success: false, error: "User not found" };
	  }
  
	  // Add the new resume object to the user's resumes array
	  user.resumes.push(newResume);
  
	  // Save the user document
	  const updatedUser = await user.save();
  
	  // Retrieve the newly added resume
	  const addedResume = updatedUser.resumes[updatedUser.resumes.length - 1];
  
	  // Return the success response with the new resume's ID
	  return { success: true, addedResume };
	} catch (err) {
	  return { success: false, error: err.message };
	}
});
  

export const changePasswordHandler = async (userId, oldPassword, newPassword) => {
	try {
		const user = await USER.findById(userId);

		if (!user) {
			return { success: false, error: "User not found" };
		}

		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) {
			return { success: false, error: "Incorrect old password" };
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		await user.save();

		return { success: true };
	} catch (err) {
		return { success: false, error: err.message };
	}
};

export const deleteUserHandler = async (userId) => {
	try {
		const user = await USER.findByIdAndDelete(userId);

		if (!user) {
			return { success: false, error: "User not found" };
		}

		return { success: true };
	} catch (err) {
		return { success: false, error: err.message };
	}
};

export const getUserProfileHandler = async (userId) => {
	try {
		const user = await USER.findById(userId)
			.populate("resumes.template")
			// .populate("resumes.resume")
			.populate("resumes.persona");

		if (!user) {
			return { success: false, error: "User not found" };
		}

		return { success: true, user };
	} catch (err) {
		return { success: false, error: err.message };
	}
};
