import { Router } from "express";
import multer from "multer";
import {uploadController} from "../controllers/upload.controller.js";
const router = Router();

// Use Multer with memory storage for a single file upload
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"text/plain"
		];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Unsupported file type"), false);
		}
	}
});

// Single file upload route
router.post("/upload", upload.single("file"), uploadController);

export default router;
