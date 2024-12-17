import {z} from "zod";

// z validation schema for calendar events
const calendarEventValidationSchema = z.object({
	jobId: z.string().optional(),
  
	title: z.string()
		.max(100, { message: "Title cannot exceed 100 characters." })
		.min(1, { message: "Title is required." }),
  
	description: z.string()
		.max(500, { message: "Description cannot exceed 500 characters." })
		.min(1, { message: "Description is required." }),
  
	date: z.string().datetime({ message: "Date must be a valid ISO date." })
		.refine(val => !isNaN(Date.parse(val)), { message: "Date must be a valid date." }),
        
	isAllDay: z.boolean().optional(),
    
	startTime: z.string()
		.datetime({ message: "Start time must be a valid ISO date." })
		.optional(),
  
	endTime: z.string()
		.datetime({ message: "End time must be a valid ISO date." })
		.optional()
		.refine((endTime, ctx) => {
			const startTime = ctx.parent.startTime;
			return startTime && Date.parse(endTime) > Date.parse(startTime);
		}, { message: "End time must be after start time." }),
  
	eventType: z.enum(["Meeting", "Task", "Reminder", "Other"],{message:"Selected event type is not registered."}).default("Other"),
  
	priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  
	isRecurring: z.boolean().optional(),
  
	recurrenceFrequency: z.enum(["Daily", "Weekly", "Monthly", "Yearly"]).optional().nullable(),
  
	reminder: z.number()
		.int({ message: "Reminder must be an integer." })
		.min(0, { message: "Reminder must be at least 0 minutes." })
		.optional()
		.default(15)
});
export default calendarEventValidationSchema;