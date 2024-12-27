import mongoose, { Schema } from "mongoose";
import {basicInfoSchema} from "./build-in-resume/BasicInfo.js";
import { educationSchema } from "./build-in-resume/Education.js";
import { experienceSchema } from "./build-in-resume/Experience.js";
import { skillSchema } from "./build-in-resume/Skills.js";
import { projectSchema } from "./build-in-resume/Projects.js";
import AUDIT_LOG from "./AuditLog.js";


const BuildInResumeSchema = new Schema({

	basicInfo:basicInfoSchema,
	education:educationSchema,
	skills:[skillSchema],
	projects: [projectSchema],
	experiences:[experienceSchema],
	persona : {
		type:mongoose.Schema.Types.ObjectId,
		ref:"Persona"
	},
	template:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Template"
	}
},{
	timestamps:true
});


BuildInResumeSchema.pre("findOneAndUpdate",async function(next){

	// this.model => this gets the current model the hook is workng on 
	// this.getQuery() => gets the query that is under process for which the hook is being initialized

	const originalDoc = await this.model.findOne(this.getQuery());
	this.set("__original",originalDoc); //temporarily storing the original doc.
	next();
});

BuildInResumeSchema.post("findOneAndUpdate",async function (doc){

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
			collectionName: "BuildInResume"
		});

	}
});

const BUILD_IN_RESUME = mongoose.model("BuildInResume",BuildInResumeSchema);

export default BUILD_IN_RESUME;