import { splitAuthorization } from "../helpers/jwt.js";
import USER from "../models/User.js";
import { verifyToken } from "../utils/token.utils.js";

export const authMiddleware = async(req,res,next)=>{

	try {
		// Express automatically normalizes header names to lowercase when storing them in req.headers.
		const { authorization } = req.headers;

		if (!authorization) {
			return res.status(401).json({
				message: "Authorization header missing.",
				data: null
			});
		}

		const token = splitAuthorization(authorization);

		// Verify the JWT token
		const userReceived = verifyToken(token) ;

		// Find user by email and ID from token payload
		const savedUser = await USER.findOne({ email: userReceived.email, _id: userReceived.id });

		if (!savedUser) {
			return res.status(401).json({
				message: "Invalid credentials, please log in again.",
				data: null
			});
		}

		req.user = savedUser;

		return next();
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