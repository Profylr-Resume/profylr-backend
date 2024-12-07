import mongoose from "mongoose";


const jobSchema=new mongoose.Schema({
	userId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	companyName:{
		type:String,
		required:[true,"Company Name is required"]
	},
	role:{
		type:String,
		required:[true,"role is required"]
	},
	status:{
		type:String,
		default:"Applied",
		enum: ["Applied", "Interview Scheduled", "Offer Received", "Rejected"]
	},
	resume:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Resume",
		required:[true,"Resume is required"]
	},
	appliedOnDate:{
		type:Date,
		default:Date.now
	},
	jobLink:{
		type:String
	},
	note:{
		type:String,
		maxLength:[500,"Notes cannot exceed 500 characters"]
	},
	followUp:{
		type:Boolean,
		default:false
	},
	followUpDate:{
		type:Date
	},
	events:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"calendarEvents"
	}],
	history:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"JobHistory"
	}]

},{	timestamps:true});

const jobModel=mongoose.model("jobs",jobSchema);

export default jobModel;