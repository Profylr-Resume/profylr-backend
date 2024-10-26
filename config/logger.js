// logger.js
import morgan from "morgan";
import fs from "fs";
import path from "path";

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(process.cwd(), "access.log"), { flags: "a" });

// Setup the logger
const logger = morgan("combined", { stream: accessLogStream });

export default logger;
