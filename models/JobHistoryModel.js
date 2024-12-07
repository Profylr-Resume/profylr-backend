import mongoose from "mongoose";

const jobHistorySchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		newData: {
			companyName: { type: String, required: [true, "Company Name is required"] },
			role: { type: String, required: [true, "Role is required"] },
			status: {
				type: String,
				default: "Applied",
				enum: ["Applied", "Interview Scheduled", "Offer Received", "Rejected"]
			},
			resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
			appliedOnDate: { type: Date, default: Date.now },
			jobLink: { type: String, default: "" },
			note: { type: String, maxLength: [500, "Notes cannot exceed 500 characters"], default: "" },
			followUp: { type: Boolean, default: false },
			followUpDate: { type: Date },
			events: [{ type: mongoose.Schema.Types.ObjectId, ref: "calendarEvents" }]
		},
		oldData: {
			companyName: { type: String },
			role: { type: String },
			status: {
				type: String,
				default: "Applied",
				enum: ["Applied", "Interview Scheduled", "Offer Received", "Rejected"]
			},
			resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
			appliedOnDate: { type: Date },
			jobLink: { type: String, default: "" },
			note: { type: String, default: "" },
			followUp: { type: Boolean, default: false },
			followUpDate: { type: Date },
			events: [{ type: mongoose.Schema.Types.ObjectId, ref: "calendarEvents" }]
		},
		changedFields: [{ type: String }] // Tracks which fields changed dynamically
	},
	{ timestamps: true } // Adds createdAt and updatedAt fields
);

const jobHistoryModel = mongoose.model("JobHistory", jobHistorySchema);

export default jobHistoryModel;
