import mongoose from "mongoose";
import AUDIT_LOG from "./AuditLog";

const historySchema = new mongoose.Schema({
	status: {
		type: String,
		required: true,
		enum: ["Applied", "Interview Scheduled", "Offer Received", "Rejected"]
	},
	date: {
		type: Date,
		default: Date.now
	},
	notes: String
});

const JobtrackingSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true
	},
	companyName: {
		type: String,
		required: [true, "Company Name is required"],
		trim: true
	},
	role: {
		type: String,
		required: [true, "Role is required"],
		trim: true
	},
	status: {
		type: String,
		default: "Applied",
		enum: ["Applied", "Interview Scheduled", "Offer Received", "Rejected"],
		index: true
	},
	resume: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Resume",
		required: true
	},
	salary: {
		offered: Number,
		currency: {
			type: String,
			default: "INR"
		}
	},
	appliedOnDate: {
		type: Date,
		default: Date.now,
		index: true
	},
	jobLink: {
		type: String,
		trim: true
	},
	note: {
		type: String,
		maxLength: [500, "Notes cannot exceed 500 characters"],
		trim: true
	},
	followUp: {
		type: Boolean,
		default: false
	},
	followUpDate: {
		type: Date,
		index: true
	},
	contactInfo: {
		name: String,
		email: String,
		phone: String,
		role: String
	},
	interviewDetails: [{
		round: Number,
		date: Date,
		type: {
			type: String,
			enum: ["Phone", "Video", "On-site", "Technical", "HR"]
		},
		notes: String
	}],
	history: [historySchema]
}, {
	timestamps: true
});

// Indexes
JobtrackingSchema.index({ companyName: 1, role: 1 });
JobtrackingSchema.index({ appliedOnDate: 1, status: 1 });

// Middleware to update history
JobtrackingSchema.pre("save",function(next){
	if(this.isModified("status")){
		this.history.push({
			status: this.status,
			date: new Date(),
			notes: this.note
		});
	}
	next();
});

JobtrackingSchema.pre("findOneAndUpdate",async function(next){

	const originalDoc = await this.model.findById(this.getQuery());
	this.set("__originalDoc",originalDoc);

	next();
} );

JobtrackingSchema.post("findOneAndUpdate",async function(updatedDocAfterQuery){

	const originalDoc = this.get("__originalDoc");

	if(originalDoc){
		const changes = [];
		for(const key in originalDoc.toObject() ){
			if(originalDoc[key] !== updatedDocAfterQuery[key]){
				changes.push({
					field:key,
					oldValue:originalDoc[key],
					newValue : updatedDocAfterQuery[key]
				});
			}
		}

		await AUDIT_LOG.create({
			documentId: updatedDocAfterQuery._id,
			collectionName: "JobTracking",
			changes
		});
	}

});

const JOB_TRACKING = mongoose.model("JobTracking", JobtrackingSchema);

export default JOB_TRACKING;


// const sampleJobData = {
// 	userId: "507f1f77bcf86cd799439011",
// 	companyName: "TechCorp Solutions",
// 	role: "Senior Full Stack Developer",
// 	status: "Interview Scheduled",
// 	resume: {
// 	  fileId: "507f1f77bcf86cd799439012",
// 	  fileName: "john_doe_resume_2024.pdf",
// 	  fileUrl: "https://storage.example.com/resumes/john_doe_2024.pdf"
// 	},
// 	salary: {
// 	  offered: 120000,
// 	  currency: "USD"
// 	},
// 	appliedOnDate: new Date("2024-01-15"),
// 	jobLink: "https://techcorp.com/careers/senior-dev-123",
// 	note: "Great initial call with the hiring manager. Team seems enthusiastic about my experience with MongoDB.",
// 	followUp: true,
// 	followUpDate: new Date("2024-01-20"),
// 	contactInfo: {
// 	  name: "Sarah Smith",
// 	  email: "sarah.smith@techcorp.com",
// 	  phone: "+1-555-0123",
// 	  role: "Technical Recruiter"
// 	},
// 	interviewDetails: [
// 	  {
// 			round: 1,
// 			date: new Date("2024-01-18"),
// 			type: "Phone",
// 			notes: "Initial screening with HR"
// 	  },
// 	  {
// 			round: 2,
// 			date: new Date("2024-01-25"),
// 			type: "Technical",
// 			notes: "System design discussion scheduled"
// 	  }
// 	],
// 	history: [
// 	  {
// 			status: "Applied",
// 			date: new Date("2024-01-15"),
// 			notes: "Application submitted via company website"
// 	  },
// 	  {
// 			status: "Interview Scheduled",
// 			date: new Date("2024-01-16"),
// 			notes: "HR reached out to schedule initial screening"
// 	  }
// 	]
// };