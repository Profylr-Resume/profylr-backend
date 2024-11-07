import USER from "../models/User.js";
import { generateToken } from "../utils/token.utils.js";
import { registerValidation } from "../validations/auth.validate.js";


export const registerUser = async (req, res) => {

	const {value,error} = registerValidation.validate(req.body);

	if (error) {
		// If there are validation errors, send a 400 Bad Request response
		return res.status(400).json({
			data:null,
			message:"Missing fields",
			error: error.details.map(detail => detail.message)
		});
	}
	const {email,name,password} = value;
  
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
		const authToken = generateToken({ email: savedUser.email, id: savedUser._id });

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

export const loginUser = async(req,res)=>{
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

	const authToken = generateToken({
		id:user._id,
		email:user.email
	});

	return res.status(200).json({
		message: "Logged in successfully.",
		data:{
			user: { id: user._id, name: user.name, email: user.email },
			authToken
		}
	});
};

export const verifyUserWithJWT = async (req, res) => {
	
	const savedUser = req.user;

	if(!savedUser){
		return res.status(500).json({
			message: "Internal server error.",
			data: null
		});
	}

	return res.status(200).json({
		message: "Token verified successfully.",
		data: {
			user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
		}
	});
};
