import { Schema } from "mongoose";

const projectSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 3
	},
	technologiesUsed: {
		type: [String],
		validate: [arr => arr.length > 0, "At least one technology must be used"]
	},
	from: {
		type: String,
		required: true,
		match: /^\d{4}-\d{2}$/ // Enforces 'YYYY-MM' format, such as '2023-07'
	},
	to: {
		type: String,
		match: /^\d{4}-\d{2}$/, // Enforces 'YYYY-MM' format, such as '2023-07'
		validate: {
			validator: function(v) {
				return new Date(v) >= new Date(this.from); // Ensures "to" is after or equal to "from"
			},
			message: "End date must be after the start date."
		}
	},
	sourceCodeRepository: {
		type: String,
		match: /^https?:\/\/.*$/i, // Ensures a valid URL format
		required: false
	},
	liveLink: {
		type: String,
		match: /^https?:\/\/.*$/i // Ensures a valid URL format
	},
	description: {
		type: [String],
		required: true,
		validate: [arr => arr.length > 0, "Description cannot be empty"]
	}
});


export const projectsSchema = new Schema({
	projects:[projectSchema]
},{timestamps:true});

projectSchema.virtual("duration").get(function() {
	const fromDate = new Date(this.from);
	const toDate = this.to ? new Date(this.to) : new Date();
	const durationInMonths = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
	return `${durationInMonths} months`;
});
 
projectsSchema.methods.getLiveProjects = function(){
	return this.projects.filter(p=>p.liveLink);
};

projectsSchema.methods.getProjectsInDescendingOrder = function(){
    
};

