import { Schema } from "mongoose";

// Certification Schema
export const certificationSchema = new Schema({
	name: String,
	issuingOrganization: String,
	issueDate: String,
	expiryDate: String,
	credentialId: String,
	url: String
}, {timestamps: true});

// Sample Certification Data
// const certificationExample = {
//     name: "AWS Solutions Architect Associate",
//     issuingOrganization: "Amazon Web Services",
//     issueDate: "2024-01-15",
//     expiryDate: "2027-01-15",
//     credentialId: "AWS-SAA-123456",
//     url: "https://aws.amazon.com/verification/12345"
// };