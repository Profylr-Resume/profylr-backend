

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
			originalName: req.file.originalname,
			mimeType: req.file.mimetype,
			base64: fileBase64
		});
	} catch (error) {
		console.error("Error processing file:", error);
		return res.status(500).json({ message: "Error processing file" });
	}
};


// Code to access the base64 string in the front end using Blob Url the below will return a link for a blob url and then we can access it accordingly

// function base64ToBlob(base64, contentType = '') {
//     const byteCharacters = atob(base64);
//     const byteArrays = [];
//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//       const slice = byteCharacters.slice(offset, offset + 512);
//       const byteNumbers = new Array(slice.length).fill(null).map((_, i) => slice.charCodeAt(i));
//       byteArrays.push(new Uint8Array(byteNumbers));
//     }
//     return new Blob(byteArrays, { type: contentType });
//   }
  

// another approach can be to access the base64 string in the front end using the file type
  
// for image files
// const imageBlob = base64ToBlob(base64String, 'image/jpeg'); // Replace 'image/jpeg' with your image's MIME type
// const imageUrl = URL.createObjectURL(imageBlob);

// const img = document.createElement('img');
// img.src = imageUrl;
// img.alt = "Preview Image";
// document.body.appendChild(img);



// for pdf files
// const pdfBlob = base64ToBlob(base64String, 'application/pdf');
// const pdfUrl = URL.createObjectURL(pdfBlob);

// const link = document.createElement('a');
// link.href = pdfUrl;
// link.target = '_blank';
// link.textContent = "View PDF";
// document.body.appendChild(link);



// for text files
// const textBlob = base64ToBlob(base64String, 'text/plain');
// const textUrl = URL.createObjectURL(textBlob);

// const iframe = document.createElement('iframe');
// iframe.src = textUrl;
// iframe.width = "100%";
// iframe.height = "400px";
// document.body.appendChild(iframe);

