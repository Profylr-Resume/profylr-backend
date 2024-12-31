import { Schema } from "mongoose";

// Extra Curricular Activities Schema
export const extraCurricularSchema = new Schema({
	activityName: String,
	role: String,
	organization: String,
	from: String,
	to: String,
	description: String
}, {timestamps: true});

// Sample Extra Curricular Activity Data
// const extraCurricularExample = {
//     activityName: "University Chess Club",
//     role: "Club President",
//     organization: "Stanford University",
//     from: "2022-09-01",
//     to: "2023-08-31",
//     description: "Led weekly meetings, organized tournaments, and grew membership by 50%"
// };