import mongoose from "mongoose";

export const connectDb = async()=>{

	try {
		await mongoose.connect(process.env.mongoDbUrl);

		console.log("db connected successfully");

	} catch (error) {
		console.log("unable to connect to db");
		process.exit(1);
	}
};

