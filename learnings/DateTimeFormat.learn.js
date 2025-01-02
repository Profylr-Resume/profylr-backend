// =====================================
// 1. JOI VALIDATION UNDERSTANDING
// =====================================

const dateValidationSchema = Joi.object({
	// .iso() - Validates that the date string is in ISO 8601 format
	// ISO 8601 Examples:
	// "2024-01-15T14:30:00Z"         (UTC/Zulu time)
	// "2024-01-15T14:30:00+05:30"    (With timezone offset)
	// "2024-01-15T14:30:00.000Z"     (With milliseconds)
	createdAt: Joi.date()
		.iso()
		.required(),

	// .raw() - Returns the original string instead of converting to Date object
	// Useful when you want to preserve the exact format sent by the client
	// Without .raw(): "2024-01-15" → Date object
	// With .raw(): "2024-01-15" → "2024-01-15" (stays as string)
	birthDate: Joi.date()
		.format("YYYY-MM-DD")
		.raw()
		.required(),

	// Custom date validation example
	appointmentDate: Joi.date()
		.min("now") // Must be future date
		.max(Joi.ref("endDate")) // Must be before endDate
		.required()
		.messages({
			"date.min": "Appointment must be in the future",
			"date.max": "Appointment must be before end date"
		})
});

// =====================================
// 2. FRONTEND DATE HANDLING
// =====================================

// HTML5 Input Types and Their Formats:
const frontendDateExamples = {
	// <input type="date"> - Returns "YYYY-MM-DD"
	dateOnly: "2024-01-15",
    
	// <input type="datetime-local"> - Returns "YYYY-MM-DDTHH:mm"
	dateTime: "2024-01-15T14:30",
    
	// <input type="time"> - Returns "HH:mm"
	timeOnly: "14:30"
};

// Frontend Date Sending Examples:
const frontendDateHandling = {
	// 1. Sending Simple Date
	sendDateToBackend: (dateString) => {
		// Convert local date to ISO string (UTC)
		const utcDate = new Date(dateString).toISOString();
		return utcDate;
		// Output: "2024-01-15T14:30:00.000Z"
	},

	// 2. Sending Date with Timezone
	sendDateWithTimezone: (dateString) => {
		return {
			date: new Date(dateString).toISOString(),
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
		};
		// Output: {
		//     date: "2024-01-15T14:30:00.000Z",
		//     timezone: "America/New_York"
		// }
	}
};

// =====================================
// 3. BACKEND DATE HANDLING
// =====================================

// MongoDB Schema with Date Handling
const appointmentSchema = new mongoose.Schema({
	// Store all dates in UTC
	appointmentDate: {
		type: Date,
		required: true,
		// Automatically convert incoming dates to UTC
		set: (date) => new Date(date),
		// Convert to ISO string when sending to frontend
		get: (date) => date.toISOString()
	},
    
	// Store timezone for reference
	userTimezone: {
		type: String,
		required: true,
		default: () => "UTC"
	}
});

// Backend Date Processing Examples
const backendDateHandling = {
	// 1. Receiving and Storing Date
	processIncomingDate: (dateString, timezone = "UTC") => {
		// Always store as UTC in MongoDB
		const utcDate = new Date(dateString);
		return {
			date: utcDate,
			timezone: timezone
		};
	},

	// 2. Sending Date to Frontend
	formatDateForClient: (mongoDate, userTimezone) => {
		// Convert UTC to user's timezone
		return {
			iso: mongoDate.toISOString(), // For technical use
			// Formatted for display
			formatted: mongoDate.toLocaleString("en-US", {
				timeZone: userTimezone,
				dateStyle: "full",
				timeStyle: "long"
			}),
			// Date only format
			dateOnly: mongoDate.toLocaleDateString("en-US", {
				timeZone: userTimezone
			}),
			// Time only format
			timeOnly: mongoDate.toLocaleTimeString("en-US", {
				timeZone: userTimezone
			})
		};
	}
};

// =====================================
// 4. API EXAMPLES
// =====================================

const dateAPI = {
	// Receiving date from frontend
	createAppointment: async (req, res) => {
		try {
			const { date, timezone } = req.body;
            
			// Validate incoming date
			const { error } = dateValidationSchema.validate({
				appointmentDate: date
			});
            
			if (error) {throw error;}
            
			// Store in MongoDB (automatically converts to UTC)
			const appointment = await Appointment.create({
				appointmentDate: new Date(date),
				userTimezone: timezone || "UTC"
			});
            
			return res.status(201).json(appointment);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	},

	// Sending date to frontend
	getAppointment: async (req, res) => {
		try {
			const appointment = await Appointment.findById(req.params.id);
            
			// Format date for client
			const formattedDate = backendDateHandling.formatDateForClient(
				appointment.appointmentDate,
				appointment.userTimezone
			);
            
			return res.json({
				...appointment.toObject(),
				formattedDate
			});
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}
};


// =========================================================================================
Explaination:
// Let me explain the key concepts in detail:

// ISO 8601 Format

// This is an international standard for representing dates and times
// Always includes the year, month, and day: YYYY-MM-DD
// Can include time: YYYY-MM-DDTHH:mm:ss
// Can include timezone: YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DDTHH:mm:ss+HH:mm
// The 'Z' suffix means UTC/Zulu time


// Joi's Date Methods

// .iso(): Validates the date is in ISO 8601 format
// .raw(): Returns the original string instead of converting to a Date object
// .format(): Specifies acceptable date format patterns
// .min() and .max(): Set date range boundaries
// .timestamp(): Validates Unix timestamps


// Frontend Date Handling

// HTML5 date inputs return specific formats:

// type="date" → "YYYY-MM-DD"
// type="datetime-local" → "YYYY-MM-DDTHH:mm"
// type="time" → "HH:mm"


// Always convert to ISO string before sending to backend
// Include user's timezone information when relevant


// Backend Date Handling

// Always store dates in UTC in MongoDB
// Store user's timezone separately
// Use getters/setters in MongoDB schema for automatic conversions
// Convert to user's timezone only when sending to frontend


// Common Pitfalls to Avoid

// Don't store dates as strings in MongoDB
// Don't mix timezone-aware and timezone-naive dates
// Don't assume user's timezone matches server timezone
// Don't forget to validate incoming dates
// Don't lose timezone information during conversions