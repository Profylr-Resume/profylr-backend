import mongoose, { Schema } from "mongoose";
import AUDIT_LOG from "./AuditLog";

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

ImportedResumeSchema.pre("findOneAndUpdate",async function(next){

	// this.model => this gets the current model the hook is workng on 
	// this.getQuery() => gets the query that is under process for which the hook is being initialized

	const originalDoc = await this.model.findOne(this.getQuery());
	this.set("__original",originalDoc); //temporarily storing the original doc.
	next();
});

ImportedResumeSchema.post("findOneAndUpdate",async function (doc){

	const originalDoc = this.get("__original");

	if(originalDoc){
		const changes = [];
		for (const key in originalDoc.toObject() ){
			if(originalDoc[key] !== doc[key] ){
				changes.push({
					field:key,
					oldValue: originalDoc[key],
					newValue: doc[key]
				});
			}
		}

		await AUDIT_LOG.create({
			changes,
			documentId: doc._id,
			collectionName: "ImportedResume"
		});

	}
});

const IMPORTED_RESUME = mongoose.model("ImportedResume", ImportedResumeSchema);

export default IMPORTED_RESUME;