import { Schema } from "mongoose";

// Languages Schema
export const languageSchema = new Schema({
	language: String,
	proficiencyLevel: {
		type: String,
		enum: ["Basic", "Intermediate", "Professional", "Native/Bilingual"]
	},
	canRead: Boolean,
	canWrite: Boolean,
	canSpeak: Boolean
}, {timestamps: true});

// Sample Language Data
// const languageExample = {
//     language: "Spanish",
//     proficiencyLevel: "Professional",
//     canRead: true,
//     canWrite: true,
//     canSpeak: true
// };
