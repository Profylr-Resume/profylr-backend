import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true
		},

		jobId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Job",
			index: true
		},

		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100
		},
		description:{
			type:String,
			maxlength:500
		},

		date: {
			type: Date,
			required: true
		},

		startTime: Date,
		endTime: Date,
		
		// location: {
		// 	type: String,
		// 	trim: true,
		// 	maxlength: 255
		// },
		// note: {
		// 	type: String,
		// 	trim: true,
		// 	maxlength: 500,
		// 	default: ""
		// },
		isAllDay: {
			type: Boolean,
			default: false
		},
		eventType: {
			type: String,
			enum: ["Meeting", "Task", "Reminder", "Other"],
			default: "Other"
		},
		priority: {
			type: String,
			enum: ["High", "Medium", "Low"],
			default: "Medium"
		},
		isRecurring: {
			type: Boolean,
			default: false
		},
		recurrenceFrequency: {
			type: String,
			enum: ["Daily", "Weekly", "Monthly", "Yearly"],
			default: null
		},
		reminder: {
			type: Number,
			default: 15 // Default to 15 minutes before the event
		}
		// status: {
		// 	type: String,
		// 	enum: ["Pending", "Completed", "Canceled"],
		// 	default: "Pending"
		// }
	},
	{
		timestamps: true // Adds createdAt and updatedAt fields
	}
);

const calendarEventModel = mongoose.model("calendarEvent", calendarEventSchema);

export default calendarEventModel;
