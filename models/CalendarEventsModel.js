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

		// required
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100
		},

		// required
		description :{
			type:String,
			maxlength:500,
			required:true
		},

		// required
		date: {
			type: Date,
			required: true
		},

		// ---
		isAllDay: {
			type: Boolean,
			default: false
		},
		startTime: Date,
		endTime: Date,
		
	
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

		// ---
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
	
	},
	{
		timestamps: true // Adds createdAt and updatedAt fields
	}
);

const CALENDAR_EVENT = mongoose.model("calendarEvent", calendarEventSchema);

export default CALENDAR_EVENT;
