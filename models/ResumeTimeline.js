import mongoose, { Schema } from "mongoose";
import AUDIT_LOG from "./AuditLog";


// This model will manage all resumes and their version relationships for a user
const ResumeVersionManagerSchema = new Schema({
	// The user who owns these resumes
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},

	// Array of resume groups, each representing a major version and its sub-versions
	resumeGroups: [{
		// Major version number (e.g., 1, 2, 3)
		majorVersion: {
			type: Number,
			required: true
		},
        
		// Array of resumes that belong to this major version
		resumes: [{
			// Reference to the Resume model (which contains meta + reference to actual resume data)
			resumeRef: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Resume",
				required: true
			},
            
			// Minor version number (e.g., 0, 1, 2) values after the decimal
			minorVersion: {
				type: Number,
				required: true
			},

			// When this version was created
			createdAt: {
				type: Date,
				default: Date.now
			},

			// Description of what changed in this version
			changeDescription: String,

			// Tags for categorizing versions
			tags: [String]
		}]
	}],

	metadata: {
		latestMajorVersion: {
			type: Number,
			default: 1
		},
		totalResumes: {
			type: Number,
			default: 1
		},
		lastUpdated: {
			type: Date,
			default: Date.now
		}
	}
}, {
	timestamps: true
});

// Methods are always called  after finding the instance(document) through user Id.
// const resumeManager = await ResumeVersionManager.findOne({ user: userId });
// await resumeManager.addMinorVersion(newResumeId, 1, "Updated education details");

// Methods for version management
ResumeVersionManagerSchema.methods = {

	// Add a new resume as a minor version to existing major version
	async addMinorVersion(resumeId, majorVersion, description) {
		const group = this.resumeGroups.find(g => g.majorVersion === majorVersion);
		if (!group) {throw new Error("Major version not found");}

		const latestMinor = Math.max(...group.resumes.map(r => r.minorVersion));
        
		group.resumes.push({
			resumeRef: resumeId,
			minorVersion: latestMinor + 1,
			changeDescription: description
		});

		this.metadata.totalResumes += 1;
		this.metadata.lastUpdated = Date.now();

		return this.save();
	},

	// Add a new resume as a new major version
	async addMajorVersion(resumeId, description) {
		const newMajorVersion = this.metadata.latestMajorVersion + 1;

		this.resumeGroups.push({
			majorVersion: newMajorVersion,
			resumes: [{
				resumeRef: resumeId,
				minorVersion: 0,
				changeDescription: description
			}]
		});

		this.metadata.latestMajorVersion = newMajorVersion;
		this.metadata.totalResumes += 1;
		this.metadata.lastUpdated = Date.now();

		return this.save();
	},

	// Get all resumes for a specific major version
	async getVersionGroup(majorVersion) {
		const group = this.resumeGroups.find(g => g.majorVersion === majorVersion);
		if (!group) {return null;}

		return await mongoose.model("Resume").find({
			"_id": { $in: group.resumes.map(r => r.resumeRef) }
		})
			.sort({ "createdAt": -1 });
	},

	// Get specific version
	async getSpecificVersion(majorVersion, minorVersion) {
		const group = this.resumeGroups.find(g => g.majorVersion === majorVersion);
		if (!group) {return null;}

		const resume = group.resumes.find(r => r.minorVersion === minorVersion);
		if (!resume) {return null;}

		return await mongoose.model("Resume").findById(resume.resumeRef);
	}
};

// Indexes for performance
ResumeVersionManagerSchema.index({ user: 1 });
ResumeVersionManagerSchema.index({ "resumeGroups.majorVersion": 1 });

ResumeVersionManagerSchema.pre("findOneAndUpdate" , async function(next){

	const originalDoc = await this.model(this.getQuery());
	this.set("__originalDoc",originalDoc);

	next();
});

ResumeVersionManagerSchema.post("findOneAndUpdate",async function(updatedDocAfterQuery){

	const originalDoc = this.get("__originalDoc");

	if(originalDoc){
		const changes = [];
		for (const key in originalDoc.toObject()){
			if(originalDoc[key] !== updatedDocAfterQuery[key]){
				changes.push({
					field:key,
					oldValue : originalDoc[key],
					newValue : updatedDocAfterQuery[key]
				});
			}
		}

		await AUDIT_LOG.create({
			changes,
			documentId: updatedDocAfterQuery._id,
			collectionName:"ResumeVersionManager"
		});
	}
});

const RESUME_VERSION_MANAGER = mongoose.model("ResumeVersionManager", ResumeVersionManagerSchema);

export default RESUME_VERSION_MANAGER;