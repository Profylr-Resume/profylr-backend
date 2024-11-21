import expressAsyncHandler from "express-async-handler";
import USER from "../models/User.js";
import { conflictError, missingFieldsError, notFoundError } from "../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../utils/success.utils.js";
import { generateToken } from "../utils/token.utils.js";
import { registerValidation } from "../validations/auth.validate.js";
import bcrypt from "bcryptjs";


// Register User
export const registerUser = expressAsyncHandler( async (req, res) => {
	const { value, error } = registerValidation.validate(req.body);

	if (error) {
		return missingFieldsError(res,error);
	}

	const { email, name, password } = value;

	// Check if user with this email already exists
	const existingUser = await USER.findOne({ email });
	if (existingUser) {
		return conflictError(res,"User",["credentials"]);
	}

	// Create and save new user
	const newUser = new USER({ name, email, password });
	const savedUser = await newUser.save();
	console.log(savedUser.password);
	// Generate JWT token for the user
	const authToken = generateToken({ email: savedUser.email, id: savedUser._id });

	return eventExecutedSuccessfully(res,{user:savedUser,jwt:authToken},"Registered successfuly");
	
});

// Login User
export const loginUser =expressAsyncHandler( async (req, res) => {
	const { email, password } = req.body;

	// Check for missing fields
	if (!email || !password) {
		return missingFieldsError(res,"Email or passwrod is missing");
	}

	// Find the user by email
	const user = await USER.findOne({ email });
	if (!user) {
		return notFoundError(res,"User",["credentials"]);
	}
	
	// Compare the provided password with the hashed password
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return notFoundError(res,"User",["credentials"]);
	}

	// Generate JWT token
	const authToken = generateToken({ id: user._id, email: user.email });

	return eventExecutedSuccessfully(res,{user,jwt:authToken},"Login Successfull");
	
});

// Verify User With JWT
export const verifyUserWithJWT = async (req, res) => {
	const savedUser = req.user; // Assumes middleware adds `req.user`

	if (!savedUser) {
		return notFoundError(res,"User",["credentials"]);
	}

	return eventExecutedSuccessfully(res,{user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }},"Logged in Successfully");
};