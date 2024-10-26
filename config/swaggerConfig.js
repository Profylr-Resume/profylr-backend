import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "My API",
			version: "1.0.0",
			description: "API documentation"
		}
	},
	apis: ["./routes/*.js"]
};

export default swaggerJsdoc(options);
