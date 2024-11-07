import morgan from "morgan";
import { v4 as uuid } from "uuid";

// Custom token for request ID
morgan.token("id", function getId(req) {
	return req.unique_req_id;
});

// Custom token for color-coded request/response
morgan.token("color", function getColor(req, res) {
	if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
		return "\x1b[30m\x1b[43m"; // Black text, light yellow background for requests
	} 
	return "\x1b[30m\x1b[42m"; // Black text, light green background for responses
  
});

// Define incoming request log format
export const incomingFormat = (tokens, req, res) => {
	const log = `Request ID: ${tokens.id(req, res)} ${tokens.method(req, res)} ${tokens.url(req, res)}`;
	return `${tokens.color(req, res)}${log}\x1b[0m`;
};

// Define response log format
export const responseFormat = (tokens, req, res) => {
	const responseTime = tokens["response-time"](req, res);
	const contentLength = res.get("content-length") || "0";
	const status = tokens.status(req, res);
	const responseTimeStr = responseTime > 2000 ? `${responseTime} ms (slow)` : `${responseTime} ms`;
	const contentLengthStr = contentLength > 1000 * 1024 ? `${contentLength} bytes (large)` : `${contentLength} bytes`;
	const statusStr = `${status}`;

	const log = `ResponseID: ${tokens.id(req, res)} ${tokens.method(req, res)} ${tokens.url(req, res)} ${statusStr} ${contentLengthStr} ${responseTimeStr}`;
	return log;
};

// Middleware to generate unique request ID
export const requestIdMiddleware = (req, res, next) => {
	req.unique_req_id = uuid(); // Unique ID for each request
	next();
};

