import { Schema } from "mongoose";

// Achievements and Awards Schema
export const achievementSchema = new Schema({
	title: String,
	issuer: String,
	date: String,
	description: String
}, {timestamps: true});

// Sample Achievement Data
// const achievementExample = {
//     title: "Employee of the Year",
//     issuer: "Tech Solutions Inc.",
//     date: "2023-12-20",
//     description: "Recognized for outstanding contributions to the company's digital transformation initiative and leading a team that increased productivity by 35%"
// };