import CALENDAR_EVENT from "../../models/CalendarEventsModel.js";
import { internalServerError, missingFieldsError, notFoundError } from "../../utils/errors.utils.js";
import { eventExecutedSuccessfully } from "../../utils/success.utils.js";
import USER from "../../models/User.js";
import jobApplicationModel from "../../models/JobApplicationModel.js";
import calendarEventValidationSchema from "../../validations/calendarEvents.validate.js";


export const createCalendarEvent = async (req, res) => {
	
	try {
	  // Validate the request body using Joi
	  const result = calendarEventValidationSchema.safeParse(req.body);
  
	  // If validation fails, send error response
		if (!result.success) {
			return res.status(400).json({
		  message: "Validation error.",
				errors: result.error.errors
			});
	    }

		// If validation passes, process the valid data
		const validData = result.data;
    
	  // Add the userId from the authenticated user
	  const userId = req.user._id;
	  const eventData = { ...validData, userId };
  
	  // Check if the user exists
		//   const user = await USER.findById(userId);
		//   if (!user) {
		// 		return notFoundError(res, "User not found");
		//   }
  
	  // Create a new calendar event
	  const newEvent = new CALENDAR_EVENT(eventData);
	  await newEvent.save();
  
	  // Add the event to the user's events array
		//   user.events.push(newEvent._id);
		//   await user.save();
  
	  // Send the response
	  return res.status(201).json({
			message: "Calendar event created successfully.",
			event: newEvent
	  });
	} catch (error) {
	  console.error("Error creating calendar event:", error);
	  return res.status(500).json({ message: "Internal server error." });
	}
};


// requires id-->userId, days--> no of days  0->> to get all calendar events
export const getAllCalendarEventsController = async (req, res) => {
	try {
		const { days } = req.params;
		const id = req.user._id;

		if (!id) {
			return missingFieldsError(res, "User ID is required");
		}

		const currentDate = new Date();

		// Calculate target date based on the 'days' parameter
		const targetDate = days === "0" ? null : new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

		// Build the pipeline
		const pipeline = [
			{
				$match: {
					userId: id,
					...(days === "0" ? {} : { date: { $lte: targetDate } }) // Match all dates if days === "0"
				}
			},
			// {
			// 	$lookup: {
			// 		from: "jobApplications",
			// 		localField: "jobId",
			// 		foreignField: "_id",
			// 		as: "jobs"
			// 	}
			// },
			// {
			// 	$unwind: "$jobs"
			// },
			// {
			// 	$project: {
			// 		userId: 1,
			// 		jobId: 1,
			// 		note_id: 1,
			// 		note: 1,
			// 		jobs: 1,
			// 		date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } // Normalize date
			// 	}
			// },
			{
				$group: {
					_id: "$date",
					events: {
						$push: {
							userId: "$userId",
							jobId: "$jobId",
							eventId: "$_id",
							note: "$note"
							// jobDetails: "$jobs"
						}
					}
				}
			}
		];

		// Execute the aggregation pipeline
		const events = await CALENDAR_EVENT.aggregate(pipeline);

		if (!events || events.length === 0) {
			const message = days === "0" 
				? "No upcoming events found for this user"
				: `No events found between now and the next ${days} days`;
			return notFoundError(res, message);
		}

		return eventExecutedSuccessfully(res, events);
	} catch (error) {
		return internalServerError(res, error.message);
	}
};


export const getAllUpComingCalendarEventsController = async (req, res) => {
	try {
		const { days } = req.params;
		const id = req.user._id;

		if (!id) {
			return missingFieldsError(res, "User ID is required");
		}

		const currentDate = new Date();

		// Calculate target date based on the 'days' parameter
		const targetDate = days === "0" ? null : new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

		// Build the pipeline
		const pipeline = [
			{
				$match: {
					userId: id,
					date: targetDate
						? { $gt: currentDate, $lte: targetDate }
						: { $gt: currentDate } // For 'days' === "0"
				}
			},
			// {
			// 	$lookup: {
			// 		from: "jobApplications",
			// 		localField: "jobId",
			// 		foreignField: "_id",
			// 		as: "jobs"
			// 	}
			// },
			// {
			// 	$unwind: "$jobs"
			// },
			{
				$group: {
					_id: "$date",
					events: {
						$push: {
							userId: "$userId",
							jobId: "$jobId",
							eventId: "$note_id",
							note: "$note"
							// jobDetails: "$jobs"
						}
					}
				}
			}
		];

		// Execute the aggregation pipeline
		const events = await CALENDAR_EVENT.aggregate(pipeline);
		console.log(events);

		if (!events || events.length === 0) {
			const message = days === "0" 
				? "No upcoming events found for this user"
				: `No events found between now and the next ${days} days`;
			return notFoundError(res, message);
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
  
		const events = await CALENDAR_EVENT.findOne({_id: id}).populate({path:"jobId",model:"jobApplications"});
  
		if (!events ) {
			return notFoundError(res, "No event found");
		}
  
		return eventExecutedSuccessfully(res, events);
	} catch (error) {
		return internalServerError(res, error.message);
	}
};
  
//  require userId,date and note    JobId (optional)


//  require userId,date and note    JobId (optional if given then required)  id-->eventId
export const updateCalendarEventController=async(req,res)=>{
	try{
		const {id}=req.params;
		const {error,value}=calendarEventValidationSchema.validate(req.body,{abortEarly:false});

		if(error){
			return missingFieldsError(res,"Missing fields");
		}
		const event=await CALENDAR_EVENT.findByIdAndUpdate(id,{$set:value},{new:true});
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
		const event=await CALENDAR_EVENT.findByIdAndDelete(id);
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
	 console.log(req);
	try {
		const id = req.user._id;
  
		console.log(id);
		if (!id) {
			return missingFieldsError(res, "User ID is required");
		}
		
		// Delete all events associated with the given userId
		const result = await CALENDAR_EVENT.deleteMany({ userId: id });
  
     
		if (result.deletedCount === 0) {
			return notFoundError(res, "No events found for the specified user");
		}
  
		return eventExecutedSuccessfully(res, result, "All events deleted successfully");
	} catch (error) {
		
		return internalServerError(res, error.message);
	}
};
  
  