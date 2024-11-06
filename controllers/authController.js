import { splitAuthorization } from "../helpers/jwt";
import USER from "../models/User";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
	const { name, email, password } = req.body;
  
	// Validate required fields
	if (!name || !email || !password) {
		return res.status(400).json({
			message: "Please fill all required fields.",
			data: null
		});
	}
  
	try {
		// Check if user with this email already exists
		const existingUser = await USER.findOne({ email });
		if (existingUser) {
			return res.status(409).json({
				message: "Email already in use.",
				data: null
			});
		}
  
		// Create and save new user (password hashing handled by pre-save hook in schema)
		const newUser = new USER({ name, email, password });
		const savedUser = await newUser.save();
  
		// Generate JWT token for the user
		const authToken = jwt.sign(
			{ email: savedUser.email, id: savedUser._id },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);
  
		return res.status(201).json({
			message: "New user registered successfully.",
			data: {
				user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
				authToken
			}
		});
	} catch (err) {
		console.error("Error saving user:", err);
		return res.status(500).json({
			message: "Error saving user to database.",
			data: null
		});
	}
};

export const Login = async(req,res)=>{
	const {email,password} = req.body;
    
	// Check for missing fields
	if (!email || !password) {
		return res.status(400).json({
			message: "Please fill all required fields.",
			data: null
		});
	}

	const user = await USER.findOne({email});

	if (!user) {
		return res.status(404).json({
			message: "User not found.",
			data: null
		});
	}
	const isMatch = await user.comparePassword(password);
    
	 if (!isMatch) {
		return res.status(401).json({
			message: "Invalid credentials.",
			data: null
		});
	}

	const authToken = jwt.sign({
		id:user._id,
		email:user.email
	},process.env.JWT_SECRET,{expiresIn:"24h"} );

	return res.status(200).json({
		message: "Logged in successfully.",
		data:{
			user: { id: user._id, name: user.name, email: user.email },
			authToken
		}
	});
};


export const verifyUserWithJWT = async (req, res) => {
	try {
		const { Authorization } = req.headers;

		if (!Authorization) {
			return res.status(401).json({
				message: "Authorization header missing.",
				data: null
			});
		}

		const token = splitAuthorization(Authorization);

		// Verify the JWT token
		const userReceived = jwt.verify(token, process.env.JWT_SECRET);

		// Find user by email and ID from token payload
		const savedUser = await USER.findOne({ email: userReceived.email, _id: userReceived.id });

		if (!savedUser) {
			return res.status(401).json({
				message: "Invalid credentials, please log in again.",
				data: null
			});
		}

		return res.status(200).json({
			message: "Token verified successfully.",
			data: {
				user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
			}
		});
	} catch (err) {
		// Handling token verification errors separately
		if (err.name === "JsonWebTokenError") {
			return res.status(401).json({
				message: "Invalid token.",
				data: null
			});
		} else if (err.name === "TokenExpiredError") {
			return res.status(401).json({
				message: "Token expired, please log in again.",
				data: null
			});
		}

		// Catching any other errors
		console.error("Error in verifyUserWithJWT:", err);
		return res.status(500).json({
			message: "Internal server error.",
			data: null
		});
	}
};
