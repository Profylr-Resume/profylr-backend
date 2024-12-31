import mongoose, { Schema } from "mongoose";
import AUDIT_LOG from "./AuditLog.js";
import { certificationSchema } from "./build-in-resume/certification.schema.js";
import { achievementSchema } from "./build-in-resume/achievementsAndAwards.schema.js";
import { extraCurricularSchema } from "./build-in-resume/extraCurricular.schema.js";
import { publicationSchema } from "./build-in-resume/publicationsAndResearch.schema.js";
import { languageSchema } from "./build-in-resume/languagesKnown.schema.js";
import { personaInfoSchema } from "./build-in-resume/personalInfo.schema.js";
import { educationSchema } from "./build-in-resume/education.schema.js";
import { skillSchema } from "./build-in-resume/technicalSkills.schema.js";
import { projectSchema } from "./build-in-resume/projects.schema.js";
import { experienceSchema } from "./build-in-resume/experience.schema.js";

// need to add schema , Everytime a new section is created
const BuildInResumeSchema = new Schema({

	personalInfo:personaInfoSchema,
	summary : {type:String},
	education: educationSchema ,
	technicalSkills:[ skillSchema ],
	projects: [ projectSchema ],
	workExperiences:[ experienceSchema],
	certifications : [certificationSchema] ,
	achievementsAndAwards : [achievementSchema] ,
	extraCurricularActivities: [extraCurricularSchema] ,
	publicationsAndResearch: [publicationSchema] ,
	languagesKnown:[languageSchema],

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