import bcrypt from "bcrypt";
import USER from "../models/User";

export const updateUserHandler = async (userId, updateFields) => {
	try {
		const user = await USER.findById(userId);

		if (!user) {
			return { success: false, error: "User not found" };
		}

		// Update the user object with provided fields
		Object.assign(user, updateFields);
		const updatedUser = await user.save();

		return { success: true, updatedUser };
	} catch (err) {
		return { success: false, error: err.message };
	}
};

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
			.populate("resumes.resume")
			.populate("resumes.template")
			.populate("personas", "name");

		if (!user) {
			return { success: false, error: "User not found" };
		}

		return { success: true, user };
	} catch (err) {
		return { success: false, error: err.message };
	}
};
