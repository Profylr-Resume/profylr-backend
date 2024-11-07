import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./config/swaggerConfig.js";
import cors from "cors";
import routes from "./routes/routes.js";
import { connectDb } from "./config/db.js";
import morgan from "morgan";
import {requestIdMiddleware,incomingFormat,responseFormat} from "./config/logger.js";
import errorHandler from "./middlewares/errorMiddleware.js";

dotenv.config();

const app= express();

connectDb();

// Apply middleware
app.use(requestIdMiddleware);
app.use(morgan(incomingFormat, { immediate: true }));
app.use(morgan(responseFormat));


app.use(express.json());
app.use(helmet());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors());

app.use(errorHandler);

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));