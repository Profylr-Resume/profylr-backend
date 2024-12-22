

export const uploadController = (req, res) => {
	try {
		console.log(req.files);
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}
  
		// Convert the file buffer to Base64
		const fileBase64 = req.file.buffer.toString("base64");
  
		// Respond with the Base64 string and file details
		return res.status(200).json({
			// originalName: req.file.originalname,
			// mimeType: req.file.mimetype,
			base64: fileBase64
		});
	} catch (error) {
		console.error("Error processing file:", error);
		return res.status(500).json({ message: "Error processing file" });
	}
};
  
