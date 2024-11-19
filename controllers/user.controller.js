import expressAsyncHandler from "express-async-handler";
import { changePasswordHandler, deleteUserHandler, getUserProfileHandler, updateUserHandler } from "../handlers/user.handler";
import { missingFieldsError } from "../utils/errors.utils";
import { eventExecutedSuccessfully } from "../utils/success.utils";


export const updateUser = expressAsyncHandler(async (req, res) => {
	const userId = req.user._id; // Assuming middleware attaches user
	const { name, email } = req.body;

	const { success, error, updatedUser } = await updateUserHandler(userId, { name, email });

	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, updatedUser, "User updated successfully");
});

export const changePassword = expressAsyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { oldPassword, newPassword } = req.body;

	const { success, error } = await changePasswordHandler(userId, oldPassword, newPassword);

	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, null, "Password changed successfully");
});

export const deleteUser = expressAsyncHandler(async (req, res) => {
	const userId = req.user._id;

	const { success, error } = await deleteUserHandler(userId);

	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, null, "User deleted successfully");
});

export const getUserProfile = expressAsyncHandler(async (req, res) => {
	const userId = req.user._id;

	const { success, error, user } = await getUserProfileHandler(userId);

	if (!success) {
		return missingFieldsError(res, error);
	}

	return eventExecutedSuccessfully(res, user, "User profile fetched successfully");
});