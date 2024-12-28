import Joi from "joi";

// Basic Info Schema
const basicInfoValidation = Joi.object({
	name: Joi.string().required().min(2),
	github: Joi.string().uri(),
	linkedIn: Joi.string().uri(),
	email: Joi.string().email().required(),
	phoneNumber: Joi.string().pattern(/^\+?[\d\s-]+$/).required()
});

// Education Schema
const educationValidation = Joi.object({
	underGraduate: Joi.object({
		instituteName: Joi.string().required(),
		field: Joi.string().required(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/).required(),
		result: Joi.string().required()
	}).required(),
	twelfthGrade: Joi.object({
		instituteName: Joi.string().required(),
		field: Joi.string().required(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/).required(),
		result: Joi.string().required()
	}).required(),
	tenthGrade: Joi.object({
		instituteName: Joi.string().required(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/).required(),
		result: Joi.string().required()
	}).required()
});

// Experience Schema
const experienceValidation = Joi.object({
	organisationName: Joi.string().required(),
	position: Joi.string().required(),
	from: Joi.string().required().pattern(/^\d{4}-\d{2}$/),
	to: Joi.string().pattern(/^\d{4}-\d{2}$/),
	description: Joi.array().items(Joi.string()).min(1).required()
});

// Project Schema
const projectValidation = Joi.object({
	name: Joi.string().required().min(3).trim(),
	technologiesUsed: Joi.array().items(Joi.string()).min(1).required(),
	from: Joi.string().required().pattern(/^\d{4}-\d{2}$/),
	to: Joi.string().pattern(/^\d{4}-\d{2}$/).custom((value, helpers) => {
		const from = helpers.state.ancestors[0].from;
		if (new Date(value) < new Date(from)) {
			return helpers.error("any.invalid");
		}
		return value;
	}, "End date validation"),
	sourceCodeRepository: Joi.string().uri(),
	liveLink: Joi.string().uri(),
	description: Joi.array().items(Joi.string()).min(1).required()
});

// Skill Schema
const skillValidation = Joi.object({
	name: Joi.string().required().trim(),
	proficiencyLevel: Joi.string()
		.valid("Beginner", "Intermediate", "Advanced", "Expert")
		.default("Intermediate"),
	yearsOfExperience: Joi.number().min(0).max(50),
	category: Joi.string().required().valid(
		"Programming Languages",
		"Frameworks & Libraries",
		"Databases",
		"Tools & Platforms",
		"Soft Skills",
		"Languages",
		"Certifications",
		"Other"
	),
	credentials: Joi.object({
		certificateUrl: Joi.string().uri(),
		issuingOrganization: Joi.string(),
		dateObtained: Joi.date(),
		expiryDate: Joi.date().min(Joi.ref("dateObtained"))
	})
});

// Complete validatin for a build In resume
const buildInResumeValidation = Joi.object({
	basicInfo: basicInfoValidation.required(),
	education: educationValidation.required(),
	skills: Joi.array().items(experienceValidation).required(),
	projects: Joi.array().items(projectValidation).required(),
	experiences: Joi.array().items(skillValidation).required(),
	persona: Joi.string().required("Need to attach persona with the resume."),
	template: Joi.string().required("Need to attach a template id with the resume.")
});

const requiredFields = [
	// Basic Info
	"basicInfo",
	"basicInfo.name",
	"basicInfo.email",
	"basicInfo.phoneNumber",

	// Education
	"education",
	"education.underGraduate",
	"education.underGraduate.instituteName",
	"education.underGraduate.field",
	"education.underGraduate.yearOfPassing",
	"education.underGraduate.result",
	"education.twelfthGrade",
	"education.twelfthGrade.instituteName",
	"education.twelfthGrade.field",
	"education.twelfthGrade.yearOfPassing",
	"education.twelfthGrade.result",
	"education.tenthGrade",
	"education.tenthGrade.instituteName",
	"education.tenthGrade.yearOfPassing",
	"education.tenthGrade.result",

	// Experience
	"experiences",
	"experiences.organisationName",
	"experiences.position",
	"experiences.from",
	"experiences.description",

	// Projects
	"projects",
	"projects.name",
	"projects.technologiesUsed",
	"projects.from",
	"projects.description",

	// Skills
	"skills",
	"skills.name",
	"skills.category",

	// Persona & Template
	"persona",
	"template"
];

const getBuildInSchemaValidation = (isUpdate=false)=>{
    
};


export default buildInResumeValidation;

// const validResume = {
// 	basicInfo: {
// 		name: "John Doe",
// 		github: "https://github.com/johndoe",
// 		linkedIn: "https://www.linkedin.com/in/johndoe/",
// 		email: "john.doe@example.com",
// 		phoneNumber: "+1234567890"
// 	},
// 	education: {
// 		underGraduate: {
// 			instituteName: "ABC University",
// 			field: "Computer Science",
// 			yearOfPassing: "2020",
// 			result: "First Class"
// 		},
// 		twelfthGrade: {
// 			instituteName: "XYZ High School",
// 			field: "Science",
// 			yearOfPassing: "2016",
// 			result: "Distinction"
// 		},
// 		tenthGrade: {
// 			instituteName: "LMN School",
// 			yearOfPassing: "2014",
// 			result: "A+"
// 		}
// 	},
// 	skills: [
// 		{
// 			name: "JavaScript",
// 			proficiencyLevel: "Advanced",
// 			yearsOfExperience: 5,
// 			category: "Programming Languages",
// 			credentials: {
// 				certificateUrl: "https://example.com/certificate",
// 				issuingOrganization: "CertOrg",
// 				dateObtained: "2018-06-15",
// 				expiryDate: "2023-06-15"
// 			}
// 		}
// 	],
// 	projects: [
// 		{
// 			name: "Portfolio Website",
// 			technologiesUsed: ["React", "Node.js", "CSS"],
// 			from: "2021-01",
// 			to: "2021-06",
// 			sourceCodeRepository: "https://github.com/johndoe/portfolio",
// 			liveLink: "https://johndoeportfolio.com",
// 			description: ["Developed a personal portfolio website to showcase projects and skills."]
// 		}
// 	],
// 	experiences: [
// 		{
// 			organisationName: "Tech Corp",
// 			position: "Software Engineer",
// 			from: "2019-06",
// 			to: "2023-06",
// 			description: ["Developed and maintained web applications.", "Collaborated with cross-functional teams."]
// 		}
// 	],
// 	persona: "persona-6574-001", (objectId)
// 	template: "template-001"(object Id)
// };
  