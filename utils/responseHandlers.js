export default class ApiResponse {
    
	constructor(statusCode, message, success, data ) {
		this.statusCode = statusCode;
		this.message = message;
		this.success = success;
		this.data = data;
		this.timestamp = new Date().toISOString();
	}
  
	static success(res, message = "Success", data = null, statusCode = 200) {
		return res.status(statusCode).json(
			new ApiResponse(statusCode, message, true, data)
		);
	}
  
	static error(res, message = "Error occurred", statusCode = 500, error = null) {
		return res.status(statusCode).json(
			new ApiResponse(statusCode, message, false, error)
		);
	}
}
  