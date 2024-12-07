import mongoose from "mongoose";


const calendarEventSchema=new mongoose.Schema({
	userId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true
	},
	jobId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"jobs"
	},
	date:{
		type:Date
	},
	note:{
		type:String
	}
});

const calendarEventModel=mongoose.model("calendarEvents",calendarEventSchema);

export default calendarEventModel;