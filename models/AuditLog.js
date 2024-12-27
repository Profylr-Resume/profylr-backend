import mongoose, { Schema } from "mongoose";
 
// this will mostly contain change history from Resume Changes and Job Tracking changes
const auditSchema = new Schema({
	documentId: mongoose.Schema.Types.ObjectId,
	collectionName: String,
	changes: [
		{
			field: String,
			oldValue: mongoose.Schema.Types.Mixed,
			newValue: mongoose.Schema.Types.Mixed
		}
	],
	updatedAt: { 
		type: Date,
		default: Date.now
	},
	updatedBy: String // optional: user making the change
});
  
const AUDIT_LOG = mongoose.model("AuditLog", auditSchema);

export default AUDIT_LOG;
