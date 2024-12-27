import mongoose, { Schema } from "mongoose";

const ResumeSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", //STATIC referencing 
		required: true
	},
	title: {
		type: String,
		required: true,
		trim: true
	},
	description: String,
	isImported: {
		type: Boolean,
		required: true
	},
	// Reference to either built or imported resume
	resumeData: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		// This will be a reference to either BuiltResume or ImportedResume
		refPath: "resumeType" // this is called DYNAMIC referencing , when we dont know which model to refer to currently , and we can get that from some other field of the same document
	},
	resumeType: { //this is the field giving the dynamic modle name above . that is why enum values are same as model name
		type: String,
		required: true,
		enum: ["BuiltResume", "ImportedResume"]
	},
	// Meta information
	status: {
		type: String,
		enum: ["active", "archived", "deleted"],
		default: "active"
	},
	tags: [String],
	starred: {
		type: Boolean,
		default: false
	},
	lastUsed: Date,
	analytics: {
		views: { type: Number, default: 0 },
		downloads: { type: Number, default: 0 },
		shares: { type: Number, default: 0 },
		lastViewed: Date
	}
}, {
	timestamps: true
});

// in case of compound indexes , mongoDb follows heiarchical flow .
//  first it will sort acoording to first value , if in some cases it is same then it will go to second value
ResumeSchema.index({ user: 1, status: 1 });
ResumeSchema.index({ tags: 1 });
ResumeSchema.index({ isImported: 1 });

const RESUME = mongoose.model("Resume",ResumeSchema);

export default RESUME;
  