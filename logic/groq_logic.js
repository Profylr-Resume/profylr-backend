const { getModules } = require("../moduleLoader");
const { axios, striptags, JSON5, DBSCAN } = getModules();

async function getAvailableAPIs() {
	const cachedAPIs = await global.redisClient.get("available_apis");
	if (cachedAPIs) {
		return JSON.parse(cachedAPIs);
	}
	const initialAPIs = {
		groq_llama3_8b: {
			url: "https://api.groq.com/openai/v1/chat/completions",
			key: process.env.GROQ_API_KEY,
			retryAfter: 0,
			models: ["llama3-8b-8192"]
		},
		groq_llama3_1_8b: {
			url: "https://api.groq.com/openai/v1/chat/completions",
			key: process.env.GROQ_API_KEY,
			retryAfter: 0,
			models: ["llama-3.1-8b-instant"]
		},
		groq_llama3_1_70b: {
			url: "https://api.groq.com/openai/v1/chat/completions",
			key: process.env.GROQ_API_KEY,
			retryAfter: 0,
			models: ["llama-3.1-70b-versatile"]
		},
		groq_llama3_70b: {
			url: "https://api.groq.com/openai/v1/chat/completions",
			key: process.env.GROQ_API_KEY,
			retryAfter: 0,
			models: ["llama3-groq-70b-8192-tool-use-preview"]
		},
		awan_llama_3_1_8b: {
			url: "https://api.awanllm.com/v1/chat/completions",
			key: process.env.AWAN_API_KEY,
			retryAfter: 0,
			models: ["Meta-Llama-3.1-8B-Instruct"]
		},
		openai_4o_mini: {
			url: "https://api.openai.com/v1/chat/completions",
			key: process.env.OPENAI_API_KEY,
			retryAfter: 0,
			models: ["gpt-4o-mini"]
		},
		deepinfra_nemotron_4_340b: {
			url: "https://api.deepinfra.com/v1/openai/chat/completions",
			key: process.env.DEEPINFRA_API_KEY,
			retryAfter: 0,
			models: ["nvidia/Nemotron-4-340B-Instruct"]
		},
		deepinfra_llama_3_70b: {
			url: "https://api.deepinfra.com/v1/openai/chat/completions",
			key: process.env.DEEPINFRA_API_KEY,
			retryAfter: 0,
			models: ["meta-llama/Meta-Llama-3-70B-Instruct"]
		},
		deepinfra_qwen2_72b: {
			url: "https://api.deepinfra.com/v1/openai/chat/completions",
			key: process.env.DEEPINFRA_API_KEY,
			retryAfter: 0,
			models: ["Qwen/Qwen2-72B-Instruct"]
		},
		deepinfra_llama_3_1_70b: {
			url: "https://api.deepinfra.com/v1/openai/chat/completions",
			key: process.env.DEEPINFRA_API_KEY,
			retryAfter: 0,
			models: ["meta-llama/Meta-Llama-3.1-70B-Instruct"]
		},
		deepinfra_llama_3_1_405b: {
			url: "https://api.deepinfra.com/v1/openai/chat/completions",
			key: process.env.DEEPINFRA_API_KEY,
			retryAfter: 0,
			models: ["meta-llama/Meta-Llama-3.1-405B-Instruct"]
		}
		// fireworks_mixtral_22b: {
		// 	url: "https://api.fireworks.ai/inference/v1/completions",
		// 	key: process.env.FIREWORKS_API_KEY,
		// 	retryAfter: 0,
		// 	models: ["accounts/fireworks/models/mixtral-8x22b-instruct"]
		// },
		// fireworks_llama_3_1_405b: {
		// 	url: "https://api.fireworks.ai/inference/v1/completions",
		// 	key: process.env.FIREWORKS_API_KEY,
		// 	retryAfter: 0,
		// 	models: ["accounts/fireworks/models/llama-v3p1-405b-instruct"]
		// },
		// fireworks_llama_3_1_70b: {
		// 	url: "https://api.fireworks.ai/inference/v1/completions",
		// 	key: process.env.FIREWORKS_API_KEY,
		// 	retryAfter: 0,
		// 	models: ["accounts/fireworks/models/llama-v3p1-70b-instruct"]
		// }
	};
	await global.redisClient.set("available_apis", JSON.stringify(initialAPIs));
	return initialAPIs;
}

function removeRedundantData(plans) {
	let accumulatedDetails = "";
	const seenSpecialTexts = new Set();

	try {
		for (let i = 0; i < plans.length; i++) {
			const currentDetails = plans[i];

			// Ensure tour_details is a string and handle null/undefined or empty objects
			const tourDetails = typeof currentDetails.tour_details === "string" ? currentDetails.tour_details.trim() : "";
			const newTourDetails = tourDetails.replace(accumulatedDetails, "").trim();

			accumulatedDetails += " " + newTourDetails;
			accumulatedDetails = accumulatedDetails.trim();

			plans[i].tour_details = newTourDetails || null; // Set to null if empty

			// Ensure special_text is a string and handle null/undefined cases
			const specialText = typeof currentDetails.special_text === "string" ? currentDetails.special_text.toLowerCase().trim() : "";

			if (specialText && seenSpecialTexts.has(specialText)) {
				plans[i].special_text = null;
			} else {
				plans[i].special_text = specialText || null; // Set to null if empty
				if (specialText) { seenSpecialTexts.add(specialText); }
			}
		}
	} catch (error) {
		console.error("An error occurred while removing redundant data:", error);
		// Optionally, you can rethrow the error or handle it based on your application's needs
	}

	return plans;
}


async function preprocessSights(req, sights, all_llm_data) {
	try {
		return await Promise.all(sights.map(async (sight) => {
			try {
				const unique_key = sight.unique_id;
				let llm_data = all_llm_data.filter(data => data.unique_key === unique_key)?.[0]?.data;
				sight.description.plan = removeRedundantData(sight.description.plan);
				if (sight.dates && Array.isArray(sight.dates)) {
					sight.dates.forEach(date => {
						if (date.plan && Array.isArray(date.plan)) {
							date.plan = removeRedundantData(date.plan);
						}
					});
				}
				if (!llm_data) {
					try {
						llm_data = await getLLMDataForSight(sight);
					} catch (error) {
						console.error(`Failed to fetch LLM data for sight ${sight.unique_id}:`, error);
						throw new Error(`Data fetch error for sight ${sight.unique_id}`);
					}

					if (Object.keys(llm_data).length === 0) {
						return null;
					}
					try {
						await req.connections.world.run(
							"REPLACE INTO llm_data (unique_key, data) VALUES (?, ?)",
							[unique_key, JSON.stringify(llm_data)]
						);
					} catch (dbError) {
						console.error(`Failed to save LLM data for sight ${sight.unique_id}:`, dbError);
						throw new Error(`Database error while saving data for sight ${sight.unique_id}`);
					}
				}

				if (Array.isArray(llm_data.duration_minutes)) {
					llm_data.duration_minutes = Math.max(...llm_data.duration_minutes);
				} else if (!isNaN(Number(llm_data.duration_minutes))) {
					llm_data.duration_minutes = Number(llm_data.duration_minutes);
				} else {
					console.error("Invalid duration_minutes for sight:", sight.unique_id);
					llm_data.duration_minutes = null; // Handle invalid data gracefully
				}

				return {
					...sight,
					llm_data,
					score: calculateSightScore(sight, llm_data)
				};
			} catch (sightError) {
				console.error(`Error processing sight ${sight.unique_id}:`, sightError);
				return null; // Or handle the error in a way that makes sense for your application
			}
		}));
	} catch (generalError) {
		console.error("Failed to preprocess sights:", generalError);
		throw new Error("Preprocessing failed for all sights");
	}
}

async function getLLMDataForSight(sight, availableAPIs, retryCount = 0) {
	availableAPIs = availableAPIs ? availableAPIs : await getAvailableAPIs();
	if (!availableAPIs) {
		throw new Error("No available APIs found.");
	}
	const apiNames = Object.keys(availableAPIs);
	const apiName = apiNames[Math.floor(Math.random() * Object.keys(availableAPIs).length)];
	const api_chosen = availableAPIs[apiName];
	const models = api_chosen.models;
	const model = models[Math.floor(Math.random() * models.length)];
	console.log(`Using API ${apiName}... AND model ${model}...`);
	if (api_chosen.retryAfter > Date.now()) {
		delete availableAPIs[apiName]; //Remove this API
		console.warn(`API ${apiName}:${model} is not available yet, retrying with next available API...`, api_chosen);
		return await getLLMDataForSight(sight, availableAPIs, retryCount + 1);
	}
	const hasAvailability = sight.availability && sight.availability.some(item => item.timings && item.timings.length > 0);
	let combinedPlans = [];
	try {
		combinedPlans = preprocessDates(sight.dates);
	} catch (error) {
		console.error("Error preprocessing dates:", error);
		return {};
	}

	const prompt = `You are an AI travel expert tasked with analyzing sight and activity data for trip planning. Given the following information about a sight/activity, provide a detailed analysis in JSON format. Focus on extracting and inferring key details that would be useful for scheduling and trip planning.

	Sight Information:
	Name: ${sight.name}
	Information: ${striptags(sight.description.tour_desc).replace(/\s+/g, " ").trim()}
	Duration: ${sight.duration} (Could be wrong, please infer from the data available)
	Available Plans and additional information:\n${formatAvailablePlans(combinedPlans)}

	Please analyze the above information and provide a JSON response with the following structure:

	{
		"duration_minutes": <integer>,
		"pickup_provided": <boolean>,
		"drop_provided": <boolean>,
		"food_provided": <boolean>,
		"category": <array of strings>,
		${hasAvailability ? "" : "\"available_plans\": <array of objects>,"}
		"best_time_of_day": <string>,
		"physical_intensity": <integer 1-5>,
		"kid_friendly": <boolean>,
		"relaxation_level": <integer 1-5>,
		"unique_experience_rating": <integer 1-5>,
		"best_for": <array of strings>,
		"is_transit_activity": <boolean>,
		"transit_type": <string>,
		"notes": <string>
	}

	Guidelines and examples:
		1. duration_minutes: Provide the best estimate in minutes. If "2 hours", use 120. Should be a number and not an array.
		2. pickup_provided & drop_provided: Infer from any mention of transport or "hotel pickup".
		3. food_provided: Look for mentions of meals, snacks, or refreshments. Just providing water or drinks is not enough.
		4. category: Choose from ["cultural", "historical", "nature", "adventure", "relaxation", "shopping", "culinary", "entertainment", "educational", "religious", "scenic", "water activity", "wildlife", "urban exploration", "rural experience", "family-friendly", "romantic", "nightlife", "wellness", "sports", "transit"]. Multiple categories can apply.
		${hasAvailability ? "" : `5. available_plans: Use the provided combined plans. The structure should be:
		[
			{
			"code": <string>,
			"weekdays": <array of strings>,
			"special_text": <string>,
			"tour_details": <string>
			},
			...
		]`}
		${hasAvailability ? "5" : "6"}. best_time_of_day: Choose from ["morning", "afternoon", "evening", "night", "any"].
		${hasAvailability ? "6" : "7"}. physical_intensity: 1 (very low, e.g., museum visit) to 5 (very high, e.g., mountain climbing).
		${hasAvailability ? "7" : "8"}. kid_friendly: Consider safety, educational value, and entertainment for children.
		${hasAvailability ? "8" : "9"}. relaxation_level: 1 (very active/exciting) to 5 (very relaxing).
		${hasAvailability ? "9" : "10"}. unique_experience_rating: 1 (common activity) to 5 (once-in-a-lifetime experience).
		${hasAvailability ? "10" : "11"}. best_for: Choose from ["solo travelers", "couples", "families", "groups", "seniors", "adventure seekers", "history buffs", "art enthusiasts", "nature lovers", "food connoisseurs", "luxury travelers", "budget travelers", "photography enthusiasts", "spiritual seekers", "culture vultures", "party-goers", "shoppers", "sports fans", "transit passengers"].
		${hasAvailability ? "11" : "12"}. is_transit_activity: Set to true if the activity is related to transit, such as airport lounges, transfer services, or waiting areas.
		${hasAvailability ? "12" : "13"}. transit_type: If is_transit_activity is true, specify the type (e.g., "airport lounge", "transfer service", "waiting area", "city tour during layover").

		Ensure all fields are filled based on the provided information and your expert knowledge. If information for a field is not explicitly provided, make a reasonable inference based on the available data. Use the "notes" field to explain any significant inferences or uncertainties.

		IMPORTANT: Respond ONLY with the JSON object. Do not include any additional text or explanations outside the JSON structure.`;
	const endpoint = api_chosen.url;
	const payload = {
		messages: [
			{ role: "system", content: "You are an AI travel expert tasked with analyzing sight and activity data for trip planning. RETURN RESPONSE AS JSON ONLY." },
			{ role: "user", content: prompt }
		],
		model,
		response_format: { type: "json_object" },
		max_tokens: 4096,
		temperature: 0.7
	};
	if (apiName.includes("nvidia")) {
		delete payload.messages[0];
		delete payload.response_format;
	}
	if (apiName.includes("fireworks")) {
		delete payload.messages;
		payload.prompt = prompt;
	}
	try {
		const response = await axios.post(
			endpoint,
			payload,
			{ headers: { "Authorization": `Bearer ${api_chosen.key}` } }
		);
		let data_key = response?.data?.choices?.[0]?.message?.content ?? response?.data?.choices?.[0]?.text;
		data_key = data_key.replace(/```/g, "").replace(/```json|```/g, "").trim();
		if (data_key) {
			try {
				const data_to_return = JSON.parse(data_key);
				if (Object.keys(data_to_return).length > 3 && data_to_return.hasOwnProperty("duration_minutes") && data_to_return.hasOwnProperty("category")) {
					data_to_return.api_used = apiName;
					return data_to_return;
				}
				console.log("Failed to get valid data from LLM, trying next API...", data_to_return, data_key);
			} catch (error) {
				console.error("Error parsing JSON:", error, data_key);
			}
		}
		if (retryCount < apiNames.length) {
			console.warn(`API ${apiName} gave no result, retrying with next available API...`, response.data);
			delete availableAPIs[apiName]; //Remove this API
			return await getLLMDataForSight(sight, availableAPIs, retryCount + 1);
		}
		throw new Error("RESULT NOT FOUND");
	} catch (error) {
		if (error?.response?.data?.error?.code == "json_validate_failed") {
			try {
				const data_to_return = JSON5.parse(error?.response?.data?.error?.failed_generation);
				if (Object.keys(data_to_return).length > 3 && data_to_return.hasOwnProperty("duration_minutes") && data_to_return.hasOwnProperty("category")) {
					data_to_return.api_used = apiName;
					return data_to_return;
				}
			} catch (error2) {
				try {
					const correctedJsonString = `${error?.response?.data?.error?.failed_generation}}`;
					const data_to_return = JSON5.parse(correctedJsonString);
					if (Object.keys(data_to_return).length > 3 && data_to_return.hasOwnProperty("duration_minutes") && data_to_return.hasOwnProperty("category")) {
						return data_to_return;
					}
				} catch (error3) {
					console.error("Error parsing JSON5:", error3);
				}
			}

		}
		if (error.response && error.response.status === 429) {
			console.warn(`API ${apiName} failed, retrying with next available API...`, error.response);
			return await getLLMDataForSight(sight, availableAPIs, retryCount + 1);
		}
		if (retryCount < apiNames.length) {
			delete availableAPIs[apiName]; //Remove this API
			console.warn(`API ${apiName} failed, retrying with next available API...`, error?.response?.data?.error?.message ?? error.message ?? error.response);
			return await getLLMDataForSight(sight, availableAPIs, retryCount + 1);
		}
		console.error("Error creating schedule:", error);
		throw error;
	}
}

const compareTourDetails = (details1, details2) => {
	// Preprocess the strings
	const preprocess = (str) => {
		try {
			return str.toLowerCase()
				.replace(/[^\w\s]/g, "") // Remove punctuation
				.replace(/\s+/g, " ") // Replace multiple spaces with single space
				.trim();
		} catch (error) {
			console.error(`Error preprocessing string: ${error.message}`);
			return ""; // Return empty string if error occurs
		}
	};

	try {
		const processedDetails1 = preprocess(details1);
		const processedDetails2 = preprocess(details2);

		// 1. Exact match after preprocessing
		if (processedDetails1 === processedDetails2) {
			return true;
		}

		// 2. Jaccard similarity for word overlap
		const getWords = (str) => {
			try {
				return str.split(" ");
			} catch (error) {
				console.error(`Error splitting words: ${error.message}`);
				return [];
			}
		};

		const words1 = new Set(getWords(processedDetails1));
		const words2 = new Set(getWords(processedDetails2));
		const intersectionSize = new Set([...words1].filter(x => words2.has(x))).size;
		const unionSize = new Set([...words1, ...words2]).size;

		const jaccardSimilarity = unionSize === 0 ? 0 : intersectionSize / unionSize;

		// 3. Levenshtein distance for overall string similarity
		const levenshteinDistance = (str1, str2) => {
			try {
				const m = str1.length, n = str2.length;
				const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
				for (let i = 0; i <= m; i++) { dp[i][0] = i; }
				for (let j = 0; j <= n; j++) { dp[0][j] = j; }
				for (let i = 1; i <= m; i++) {
					for (let j = 1; j <= n; j++) {
						if (str1[i - 1] === str2[j - 1]) {
							dp[i][j] = dp[i - 1][j - 1];
						} else {
							dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
						}
					}
				}
				return dp[m][n];
			} catch (error) {
				console.error(`Error calculating Levenshtein distance: ${error.message}`);
				return Math.max(str1.length, str2.length); // Return maximum possible distance on error
			}
		};

		const maxLength = Math.max(processedDetails1.length, processedDetails2.length);
		const levenshteinSimilarity = maxLength === 0 ? 1 : 1 - (levenshteinDistance(processedDetails1, processedDetails2) / maxLength);

		// 4. Check for significant phrase overlap
		const getPhrases = (str) => {
			try {
				return str.match(/\b(\w+(?:\s+\w+){2,3})\b/g) || [];
			} catch (error) {
				console.error(`Error extracting phrases: ${error.message}`);
				return [];
			}
		};

		const phrases1 = new Set(getPhrases(processedDetails1));
		const phrases2 = new Set(getPhrases(processedDetails2));
		const commonPhrases = new Set([...phrases1].filter(x => phrases2.has(x)));
		const phraseOverlapRatio = Math.min(phrases1.size, phrases2.size) === 0 ? 0 : commonPhrases.size / Math.min(phrases1.size, phrases2.size);

		// Combine the similarity measures
		const jaccardWeight = 0.4;
		const levenshteinWeight = 0.4;
		const phraseWeight = 0.2;
		const similarityScore = (jaccardSimilarity * jaccardWeight) +
			(levenshteinSimilarity * levenshteinWeight) +
			(phraseOverlapRatio * phraseWeight);

		// Adjust this threshold based on your needs
		const similarityThreshold = 0.8;

		return similarityScore >= similarityThreshold;
	} catch (error) {
		console.error(`Error in compareTourDetails: ${error.message}`);
		return false; // Return false if an error occurs during the comparison
	}
};


function preprocessDates(dates) {
	const combinedPlans = [];

	const getDayOfWeek = (dateString) => {
		try {
			const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			const date = new Date(dateString);
			if (isNaN(date.getTime())) {
				throw new Error(`Invalid date string: ${dateString}`);
			}
			return days[date.getDay()];
		} catch (error) {
			console.error(`Error in getDayOfWeek: ${error.message}`);
			return null; // Return a default value or handle it based on your requirements
		}
	};

	const combineSpecialText = (existing, new_text) => {
		try {
			const words = new Set([...existing.split(/\s+/), ...new_text.split(/\s+/)]);
			return Array.from(words).join(" ");
		} catch (error) {
			console.error(`Error in combineSpecialText: ${error.message}`);
			return existing; // Return the existing text if there's an error
		}
	};

	try {
		dates.forEach(dateObj => {
			const day = getDayOfWeek(dateObj.from_date);
			if (day === null) {
				return;
			} // Skip processing if date is invalid

			if (!Array.isArray(dateObj.plan)) {
				throw new Error(`Invalid plan array in date object: ${JSON.stringify(dateObj)}`);
			}

			dateObj.plan.forEach(plan => {
				const existingPlan = combinedPlans.find(
					p => p.code === plan.code && compareTourDetails(p.tour_details, plan.tour_details)
				);

				if (existingPlan) {
					if (!existingPlan.weekday.includes(day)) {
						existingPlan.weekday.push(day);
					}
					existingPlan.special_text = combineSpecialText(existingPlan.special_text || "", plan.special_text || "");
				} else {
					combinedPlans.push({
						code: plan.code,
						special_text: plan.special_text || "", // Ensure special_text is a string
						weekday: [day],
						tour_details: plan.tour_details
					});
				}
			});
		});
	} catch (error) {
		console.error(`Error in preprocessDates: ${error.message}`);
		// Handle the error or rethrow it
	}

	return combinedPlans;
}

const formatAvailablePlans = (plans) => {
	try {
		return plans
			.filter(plan => plan.code) // Skip plans without a code
			.map(plan => {
				// Handle potential null or undefined values for plan properties
				const specialText = plan.special_text || "";
				let information = "";

				try {
					// Use striptags to sanitize specialText and handle errors
					information = striptags(specialText).replace(/\s+/g, " ").trim();
				} catch (error) {
					console.error(`Error processing special_text: ${error.message}`);
					information = ""; // Fallback to empty string if error occurs
				}

				// Handle potential null or undefined values for tour_details
				const tourDetails = plan.tour_details || "";
				const details = tourDetails.length > 5 ? `Details: ${tourDetails}` : "";

				try {
					// Construct the formatted string with appropriate checks
					return `Code: ${plan.code || "N/A"}, Available Days: ${Array.isArray(plan.weekday) ? plan.weekday.join(", ") : "N/A"}${information ? `, Information: ${information}` : ""}${details ? `, ${details}` : ""}`;
				} catch (error) {
					console.error(`Error constructing formatted string for plan: ${error.message}`);
					return "Invalid plan data"; // Fallback if any unexpected error occurs
				}
			}).join("\n");
	} catch (error) {
		console.error(`Error formatting available plans: ${error.message}`);
		return ""; // Fallback to empty string if error occurs in the entire function
	}
};

function calculateSightScore(sight, llm_data) {
	let score = 0;
	score += (1 / (sight.result_index || 1)) * 50; // Popularity
	score += llm_data.unique_experience_rating * 10;
	score += (5 - Math.abs(3 - llm_data.physical_intensity)) * 5; // Prefer moderate intensity
	score += llm_data.kid_friendly ? 10 : 0;
	score += llm_data.is_transit_activity ? -20 : 0; // Slightly discourage transit activities

	// Consider time of day preference
	const timePreferenceScore = calculateTimePreferenceScore(sight, llm_data);
	score += timePreferenceScore;

	// Add score based on relaxation level
	score += llm_data.relaxation_level * 3;

	// Add score based on duration (prefer activities around 2-3 hours)
	const durationScore = calculateDurationScore(llm_data.duration_minutes);
	score += durationScore;

	return score;
}

function calculateDurationScore(durationMinutes) {
	const optimalDuration = 150; // 2.5 hours
	const durationDifference = Math.abs(durationMinutes - optimalDuration);
	return Math.max(0, 10 - durationDifference / 60); // Max 10 points, decreasing by 1 for every 15 minutes difference
}

function calculateTimePreferenceScore(sight, llm_data) {
	const preferredTime = llm_data.best_time_of_day;
	switch (preferredTime) {
	case "morning":
		return 5;
	case "afternoon":
		return 3;
	case "evening":
		return 1;
	case "any":
		return 6; // Flexible time options are generally good
	default:
		return 0;
	}
}

const isSightAvailable = (sight, currentWeekday) => {
	// Check primary availability data
	const primaryAvailability = sight.availability.some(avail => avail.weekday === currentWeekday && avail.timings.length > 0);
	if (primaryAvailability) { return true; }

	// If primary availability is not present or has no timings, check LLM data
	if (sight.llm_data && sight.llm_data.available_plans) {
		const llmAvailability = sight.llm_data.available_plans.some(avail =>
			(avail.weekday === currentWeekday ||
				["any", "Any", "daily", "Daily"].includes(avail.weekday)) &&
			avail.timings && avail.timings.length > 0
		);
		return llmAvailability;
	}

	return false;
};

function createDailyClusters(processedSights, constraints) {
	const dailyClusters = {};
	let currentDate = constraints.check_in_date;

	while (currentDate <= constraints.check_out_date) {
		const currentWeekday = currentDate.weekdayLong;
		const availableSights = processedSights.filter(sight => isSightAvailable(sight, currentWeekday));

		if (availableSights.length > 0) {
			const features = availableSights.map(sight => [
				sight.llm_data.physical_intensity,
				sight.llm_data.relaxation_level,
				sight.llm_data.unique_experience_rating,
				calculateSightScore(sight, sight.llm_data),
				...encodeSightCategories(sight.llm_data.category)
			]);

			const { epsilon, minPoints } = calculateDBSCANParams(features);
			const dbscan = new DBSCAN();
			const clusters = dbscan.run(features, epsilon, minPoints);

			dailyClusters[currentDate.toISODate()] = clusters.reduce((acc, cluster, index) => {
				acc[index] = cluster.map(pointIndex => availableSights[pointIndex]);
				return acc;
			}, {});

			// Handle outliers and create artificial clusters if needed
			const outliers = availableSights.filter((_, index) =>
				!clusters.some(cluster => cluster.includes(index))
			);

			if (Object.keys(dailyClusters[currentDate.toISODate()]).length === 0 && outliers.length > 0) {
				const artificialClusters = createArtificialClusters(outliers, constraints.max_duration_per_day);
				dailyClusters[currentDate.toISODate()] = artificialClusters;
			} else if (outliers.length > 0) {
				dailyClusters[currentDate.toISODate()]["outliers"] = outliers;
			}

			// Score and rank clusters
			const rankedClusters = rankClusters(dailyClusters[currentDate.toISODate()], constraints);
			dailyClusters[currentDate.toISODate()] = rankedClusters;
		} else {
			dailyClusters[currentDate.toISODate()] = {};
		}

		currentDate = currentDate.plus({ days: 1 });
	}

	return dailyClusters;
}

function calculateDBSCANParams(features) {
	const distances = [];
	for (let i = 0; i < features.length; i++) {
		for (let j = i + 1; j < features.length; j++) {
			distances.push(euclideanDistance(features[i], features[j]));
		}
	}
	const epsilon = median(distances);
	const minPoints = Math.max(2, Math.floor(Math.sqrt(features.length)));
	return { epsilon, minPoints };
}

// Helper function for euclidean distance
function euclideanDistance(a, b) {
	return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

// Helper function for median
function median(arr) {
	const sorted = arr.slice().sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Improved createArtificialClusters function
function createArtificialClusters(outliers, maxDurationPerDay) {
	const sortedOutliers = outliers.sort((a, b) => calculateSightScore(b, b.llm_data) - calculateSightScore(a, a.llm_data));
	const artificialClusters = {};
	let clusterIndex = 0;
	let currentCluster = [];
	let currentDuration = 0;

	for (const sight of sortedOutliers) {
		if (currentDuration + sight.llm_data.duration_minutes <= maxDurationPerDay) {
			currentCluster.push(sight);
			currentDuration += sight.llm_data.duration_minutes;
		} else {
			if (currentCluster.length > 0) {
				artificialClusters[clusterIndex] = currentCluster;
				clusterIndex++;
			}
			currentCluster = [sight];
			currentDuration = sight.llm_data.duration_minutes;
		}
	}

	if (currentCluster.length > 0) {
		artificialClusters[clusterIndex] = currentCluster;
	}

	return artificialClusters;
}

// New function to rank clusters
function rankClusters(clusters, constraints) {
	const rankedClusters = Object.entries(clusters).map(([index, cluster]) => ({
		index,
		cluster,
		score: calculateClusterScore(cluster, constraints)
	}));

	rankedClusters.sort((a, b) => b.score - a.score);

	return rankedClusters.reduce((acc, { index, cluster }) => {
		acc[index] = cluster;
		return acc;
	}, {});
}

// New function to calculate cluster score
function calculateClusterScore(cluster, constraints) {
	const totalDuration = cluster.reduce((sum, sight) => sum + sight.llm_data.duration_minutes, 0);
	const averageScore = cluster.reduce((sum, sight) => sum + calculateSightScore(sight, sight.llm_data), 0) / cluster.length;
	const diversity = calculateClusterDiversity(cluster);

	let score = averageScore * 0.5 + diversity * 30;

	// Penalize if total duration exceeds max_duration_per_day
	if (totalDuration > constraints.max_duration_per_day) {
		score -= (totalDuration - constraints.max_duration_per_day) / 30; // Subtract 1 point for every 30 minutes over
	}

	return score;
}

function encodeSightCategories(categories) {
	const allCategories = ["nature", "culture", "adventure", "relaxation", "shopping", "food"];
	return allCategories.map(cat => categories.includes(cat) ? 1 : 0);
}

function calculateClusterDiversity(cluster) {
	const categories = cluster.flatMap(sight => sight.llm_data.category);
	const uniqueCategories = new Set(categories);
	return uniqueCategories.size / cluster.length;
}

function chooseBestCluster(clusters, currentDate, events) {
	return Object.entries(clusters).reduce((best, [clusterIndex, cluster]) => {
		const avgScore = cluster.reduce((sum, sight) => sum + sight.score, 0) / cluster.length;
		const diversity = calculateClusterDiversity(cluster);
		const balancedScore = avgScore * diversity;
		return balancedScore > best.balancedScore ? { cluster, balancedScore } : best;
	}, { cluster: clusters[Object.keys(clusters)[0]], balancedScore: -Infinity }).cluster;
}

module.exports = { getAvailableAPIs, preprocessSights, calculateSightScore, calculateTimePreferenceScore, createDailyClusters, chooseBestCluster };