import mongoose, { Schema } from "mongoose";


const templateSchema = new Schema({
	name:String,
	description:String,
	html:String,
	sections:[{
		section:{
			type:Schema.Types.ObjectId,
			ref:"ResumeSection"
		},
		html:{
			type:String,
			required:true
		}
	}],
	thumbnail:String
});

const TEMPLATE = mongoose.model("Template",templateSchema);

export default TEMPLATE;


// const templateDummy = {
//     name: "Basic Template",
//     description: "A simple and minimal resume template.",
//     html: "<div><h1>Resume</h1></div>", // Basic HTML for the template
//     sections: [
//         {
//             section: "637a82e1b5d7c4320f45e4a1", // Example ObjectId for a section
//             html: "<div><h2>Section Title</h2><p>Section Content</p></div>", // Minimal section HTML
//         },
//         {
//             section: "637a82e1b5d7c4320f45e4a2", // Another Example ObjectId
//             html: "<div><h2>Another Section</h2><p>Details about this section.</p></div>",
//         },
//     ],
//     thumbnail: "https://example.com/thumbnail.jpg", // Placeholder thumbnail URL
// };
