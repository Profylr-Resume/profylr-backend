import calendarEventModel from "../../models/CalendarEventsModel.js";
import { internalServerError, missingFieldsError, notFoundError } from "../../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../../utils/success.utils.js";
import calendarEventValidationSchema from "../../validations/calendarEvents.validate.js";
import jobModel from "../../models/JobModel.js";


// requires id-->userId, days--> no of days  0->> to get all calendar events
export const getAllCalendarEventsController = async (req, res) => {
	try {
		const { id, days } = req.params;
  
		if (!id) {
			return missingFieldsError(res, "User ID is required");
		}
  
		const currentDate = new Date();
  
		if (days==="0") {
			const events = await calendarEventModel.find({
				userId: id
				// date: { $gt: currentDate }  //uncomment this to get all the events after the current date
			}).populate({path:"jobId",model:"jobs"});
			if (!events || events.length === 0) {
				return notFoundError(res, "No upcoming events found for this user");
			}
			return eventExecutedSuccessfully(res, events);
		}
  
		const targetDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
  
		const events = await calendarEventModel.find({
			userId: id,
			date: { $gt: currentDate, $lte: targetDate }
		}).populate({path:"jobId",model:"jobs"});
  
		if (!events || events.length === 0) {
			return notFoundError(res, `No events found between now and the next ${days} days`);
		}
  
		return eventExecutedSuccessfully(res, events);
	} catch (error) {
		return internalServerError(res, error.message);
	}
};

export const getAllUpComingCalendarEventsController = async (req, res) => {
	try {
		const { id, days } = req.params;
  
		if (!id) {
			return missingFieldsError(res, "User ID is required");
		}
  
		const currentDate = new Date();
  
		if (days==="0") {
			const events = await calendarEventModel.find({
				userId: id,
				date: { $gt: currentDate } //uncomment this to get all the events after the current date
			}).populate({path:"jobId",model:"jobs"});
			if (!events || events.length === 0) {
				return notFoundError(res, "No upcoming events found for this user");
			}
			return eventExecutedSuccessfully(res, events);
		}
  
		const targetDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
  
		const events = await calendarEventModel.find({
			userId: id,
			date: { $gt: currentDate, $lte: targetDate }
		}).populate({path:"jobId",model:"jobs"});
  
		if (!events || events.length === 0) {
			return notFoundError(res, `No events found between now and the next ${days} days`);
		}
  
		return eventExecutedSuccessfully(res, events);
	} catch (error) {
		return internalServerError(res, error.message);
	}
};


// id--> calendar Id
export const getCalendarEventsController = async (req, res) => {
	try {
		const { id } = req.params;
  
		if (!id) {
			return missingFieldsError(res, "User ID is required");
		}
  
		const events = await calendarEventModel.findOne({_id: id});
  
		if (!events ) {
			return notFoundError(res, "No event found");
		}
  
		return eventExecutedSuccessfully(res, events);
	} catch (error) {
		return internalServerError(res, error.message);
	}
};
  
//  require userId,date and note    JobId (optional)
export const createCalendarEventController=async(req,res)=>{
	try{
		const {error,value}=calendarEventValidationSchema.validate(req.body,{abortEarly:false});

		if(error){
			return missingFieldsError(res,"Missing fields");
		}
		const newEvent=new calendarEventModel(value);
		await newEvent.save();

		return eventExecutedSuccessfully(res,newEvent,"Event created successfully");

	} catch (error) {
		return internalServerError(res, error.message);
	}
};


//  require userId,date and note    JobId (optional if given then required)  id-->eventId
export const updateCalendarEventController=async(req,res)=>{
	try{
		const {id}=req.params;
		const {error,value}=calendarEventValidationSchema.validate(req.body,{abortEarly:false});

		if(error){
			return missingFieldsError(res,"Missing fields");
		}
		const event=await calendarEventModel.findByIdAndUpdate(id,{$set:value},{new:true});
		await event.save();

		return eventExecutedSuccessfully(res,event,"Event updated successfully");

	} catch (error) {
		return internalServerError(res, error.message);
	}
};

//  require event id
export const deleteCalendarEventController=async(req,res)=>{
	try{
		const {id}=req.params;
		if (!id) {
			return missingFieldsError(res, "Event ID is required");
		}
		const event=await calendarEventModel.findByIdAndDelete(id);
		if(!event){
			return notFoundError(res,"No event found");
		}
		return eventExecutedSuccessfully(res,event,"Deleted successfully");
	}catch (error) {
		return internalServerError(res, error.message);
	}
};

// require userId
export const deleteAllCalendarEventController = async (req, res) => {
	try {
		const { id } = req.params;
  
      
		if (!id) {
			return missingFieldsError(res, "User ID is required");
		}
  
		// Delete all events associated with the given userId
		const result = await calendarEventModel.deleteMany({ userId: id });
  
     
		if (result.deletedCount === 0) {
			return notFoundError(res, "No events found for the specified user");
		}
  
		return eventExecutedSuccessfully(res, result, "All events deleted successfully");
	} catch (error) {
		
		return internalServerError(res, error.message);
	}
};
  
  