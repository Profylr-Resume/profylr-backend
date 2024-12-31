import { Schema } from "mongoose";

// Publications and Research Schema
export const publicationSchema = new Schema({
	title: String,
	authors: [String],
	publishedIn: String,
	publicationDate: String,
	doi: String,
	url: String,
	abstract: String
}, {timestamps: true});

// Sample Publication Data
// const publicationExample = {
//     title: "Machine Learning Applications in Modern Healthcare",
//     authors: ["John Doe", "Jane Smith", "Robert Johnson"],
//     publishedIn: "Journal of Medical Informatics",
//     publicationDate: "2023-06-15",
//     doi: "10.1234/jmi.2023.12345",
//     url: "https://doi.org/10.1234/jmi.2023.12345",
//     abstract: "This paper explores the innovative applications of machine learning algorithms in healthcare diagnostics and treatment planning..."
// };

