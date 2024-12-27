import mongoose, { Schema } from "mongoose";

const ImportedResumeSchema = new Schema({
	fileUrl: {
		type: String,
		required: true
	},
	fileType: {
		type: String,
		enum: ["pdf", "doc", "docx"],
		required: true
	},
	originalFileName: String,
	fileSize: Number,
	uploadDate: {
		type: Date,
		default: Date.now
	}
}, {
	timestamps: true
});

const IMPORTED_RESUME = mongoose.model("ImportedResume", ImportedResumeSchema);

export default IMPORTED_RESUME;