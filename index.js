import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./config/swaggerConfig.js";
import cors from "cors";
import logger from "./config/logger.js";
import routes from "./routes/routes.js";

dotenv.config();

const app= express();

app.use(express.json());
app.use(helmet());
app.use(logger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors());

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,
	()=>console.log(`Server running on port ${PORT}`));