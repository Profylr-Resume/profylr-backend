import Joi from "joi";
import { makeFieldsRequired } from "../utils/mongoDb";
import { validationSchema } from "../../utils/mongoDb";

// 1
const personalInfoValidation = Joi.object({
	firstName: Joi.string().min(2),
	lastName: Joi.string().min(2),
	github: Joi.string().uri(),
	portfolio: Joi.string().uri(),
	linkedIn: Joi.string().uri(),
	email: Joi.string().email(),
	contactNumber: Joi.string().pattern(/^\+?[\d\s-]+$/)
});

// 2
const educationValidation = Joi.object({
	underGraduate: Joi.object({
		instituteName: Joi.string(),
		field: Joi.string(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/),
		result: Joi.string()
	}),
	twelfthGrade: Joi.object({
		instituteName: Joi.string(),
		field: Joi.string(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/),
		result: Joi.string()
	}),
	tenthGrade: Joi.object({
		instituteName: Joi.string(),
		yearOfPassing: Joi.string().pattern(/^\d{4}$/),
		result: Joi.string()
	})
});

// 3
const experienceValidation = Joi.object({
	organisationName: Joi.string(),
	position: Joi.string(),
	from: Joi.string().pattern(/^\d{4}-\d{2}$/),
	to: Joi.string().pattern(/^\d{4}-\d{2}$/),
	description: Joi.array().items(Joi.string()).min(1)
});

// 4
const projectValidation = Joi.object({
	name: Joi.string().min(3).trim(),
	technologiesUsed: Joi.array().items(Joi.string()).min(1),
	from: Joi.string().pattern(/^\d{4}-\d{2}$/),
	to: Joi.string().pattern(/^\d{4}-\d{2}$/).custom((value, helpers) => {
		const from = helpers.state.ancestors[0].from;
		if (new Date(value) < new Date(from)) {
			return helpers.error("any.invalid");
		}
		return value;
	}, "End date validation"),
	sourceCodeRepository: Joi.string().uri(),
	liveLink: Joi.string().uri(),
	description: Joi.array().items(Joi.string()).min(1)
});

// 5
const skillValidation = Joi.object({
	name: Joi.string().trim(),
	proficiencyLevel: Joi.string()
		.valid("Beginner", "Intermediate", "Advanced", "Expert")
		.default("Intermediate"),
	yearsOfExperience: Joi.number().min(0).max(50),
	category: Joi.string().valid(
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

// 6
const certificateValidation = Joi.object({
	name: Joi.string(),
	issuingOrganization: Joi.string(),
	issueDate: Joi.date().iso(),
	expiryDate: Joi.date().iso().allow(null, ""),
	credentialId: Joi.string().allow(null, ""),
	url: Joi.string().uri().allow(null, "")
});

// 7
const achievementsAndAwardsValidation = Joi.object({	
	title: Joi.string().min(3).max(100).trim() ,
	issuer: Joi.string.min(3).max(50).trim(),
	date: Joi.date().max("now"),
	description : Joi.string().max(500).trim().allow("").default("")
});

// 8
const extraCurricularValidation = Joi.object({
	activityName : Joi.string().min(3),
	role: Joi.string().min(3),
	organisationName: Joi.string().min(3),
	from : Joi.string(),
	to : Joi.string(),
	description : Joi.string()
});

// 9
const publicationsAndResearchValidation = Joi.object({
	title : Joi.string().min(3).max(100).trim(),
	authors : Joi.array().items(Joi.string()),
	publishedIn: Joi.string().trim(),
	publicationDate: Joi.date().iso().max("now"),
	doi: Joi.string(),
	url : Joi.string().uri(),
	abstract: Joi.string().trim()
});

// 10
const languageKnownValidation = Joi.object({
	language : Joi.string().trim(),
	proficiencyLevel : Joi.string().valid("Basic", "Intermediate", "Professional", "Native/Bilingual"),
	canRead: Joi.boolean(),
	canWrite : Joi.boolean(),
	canSpeak : Joi.boolean()
});

// Complete validatin for a build In resume
const baseSchemaValidation = Joi.object({
	personalInfo: personalInfoValidation,
	summary: Joi.string().min(10).max(500), 
	education: educationValidation,
	technicalSkills: Joi.array().items(skillValidation),
	workExperiences: Joi.array().items(experienceValidation),
	projects: Joi.array().items(projectValidation),
	certifications: Joi.array().items(certificateValidation),
	achievementsAndAwards: Joi.array().items(achievementsAndAwardsValidation),
	extraCurricular: Joi.array().items(extraCurricularValidation),
	publicationsAndResearch : Joi.array().items(publicationsAndResearchValidation),
	languagesKnown : Joi.array().items(languageKnownValidation),

	persona: Joi.string(),
	template: Joi.string()
});

// If you omit a main key (like mainKey1), its required fields won't matter.
// If you include a main key, you must satisfy all its .required() fields.

const requiredFields = [

	// personal Info
	"personalInfo",
	"personalInfo.name",
	"personalInfo.email",
	"personalInfo.phoneNumber",

	// Education
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
    
	// Skills
	"technicalSkills.name",
	"technicalSkills.category",

	// Experience
	"workExperiences.organisationName",
	"workExperiences.position",
	"workExperiences.from",
	"workExperiences.description",

	// Projects
	"projects.name",
	"projects.technologiesUsed",
	"projects.from",
	"projects.description",
	

	// certifications
	"certifications.name",
	"certifications.issuingOrganization",
	"certifications.issueDate",
	
	// achievementsAndAwards
	"achievementsAndAwards.title",
	"achievementsAndAwards.issuer",
	
	// extraCurricular
	"extraCurricular.activityName",
	"extraCurricular.from",

	// publicationsAndResearch
	"publicationsAndResearch.title",
	"publicationsAndResearch.publicationDate",
     
	// languagesKnown
	"languagesKnown.language",
	"languagesKnown.proficiencyLevel",

	// Persona & Template
	"persona",
	"template"
];

export const validateBuildInResumeForCreation = validationSchema({isUpdate:false, requiredFields , baseSchemaValidation });
export const validateBuildInResumeForUpdate = validationSchema({isUpdate:true, requiredFields , baseSchemaValidation });

// =======================================================================
// const dummyResume = {
// 	personalInfo: {
// 		firstName: "John",
// 		lastName: "Doe",
// 		github: "https://github.com/johndoe",
// 		portfolio: "https://johndoe.dev",
// 		linkedIn: "https://www.linkedin.com/in/johndoe",
// 		email: "johndoe@example.com",
// 		contactNumber: "+1234567890"
// 	},
// 	summary: "A passionate software engineer with expertise in full-stack development, eager to contribute to innovative projects.",
// 	education: {
// 		underGraduate: {
// 			instituteName: "XYZ University",
// 			field: "Computer Science",
// 			yearOfPassing: "2022",
// 			result: "8.5 CGPA"
// 		},
// 		twelfthGrade: {
// 			instituteName: "ABC High School",
// 			field: "Science",
// 			yearOfPassing: "2018",
// 			result: "85%"
// 		},
// 		tenthGrade: {
// 			instituteName: "LMN Secondary School",
// 			yearOfPassing: "2016",
// 			result: "90%"
// 		}
// 	},
// 	technicalSkills: [
// 		{
// 			name: "JavaScript",
// 			proficiencyLevel: "Advanced",
// 			yearsOfExperience: 3,
// 			category: "Programming Languages"
// 		},
// 		{
// 			name: "React.js",
// 			proficiencyLevel: "Advanced",
// 			yearsOfExperience: 2,
// 			category: "Frameworks & Libraries"
// 		}
// 	],
// 	workExperiences: [
// 		{
// 			organisationName: "TechCorp",
// 			position: "Software Developer",
// 			from: "2022-05",
// 			to: "2024-01",
// 			description: ["Developed scalable web applications", "Improved system performance by 20%"]
// 		}
// 	],
// 	projects: [
// 		{
// 			name: "Portfolio Website",
// 			technologiesUsed: ["React.js", "Node.js"],
// 			from: "2023-01",
// 			to: "2023-04",
// 			sourceCodeRepository: "https://github.com/johndoe/portfolio",
// 			liveLink: "https://johndoe.dev",
// 			description: ["Designed and developed a responsive portfolio website", "Integrated GitHub projects and blogs"]
// 		}
// 	],
// 	certifications: [
// 		{
// 			name: "AWS Certified Solutions Architect",
// 			issuingOrganization: "Amazon Web Services",
// 			issueDate: "2023-02-15",
// 			expiryDate: "2026-02-15",
// 			credentialId: "ABC123XYZ",
// 			url: "https://aws.amazon.com/certification"
// 		}
// 	],
// 	achievementsAndAwards: [
// 		{
// 			title: "Hackathon Winner",
// 			issuer: "TechFest",
// 			date: "2021-12-10",
// 			description: "Won 1st place for developing an AI-powered chatbot"
// 		}
// 	],
// 	extraCurricular: [
// 		{
// 			activityName: "Basketball",
// 			role: "Captain",
// 			organisationName: "XYZ University",
// 			from: "2018",
// 			to: "2022",
// 			description: "Led the university team to regional championships"
// 		}
// 	],
// 	publicationsAndResearch: [
// 		{
// 			title: "Optimizing Machine Learning Algorithms",
// 			authors: ["John Doe", "Jane Smith"],
// 			publishedIn: "International Journal of AI Research",
// 			publicationDate: "2022-06-15",
// 			doi: "10.1234/ijair.2022.001",
// 			url: "https://ijair.com/paper/optimizing-ml",
// 			abstract: "This paper discusses methods to optimize training in machine learning models."
// 		}
// 	],
// 	languagesKnown: [
// 		{
// 			language: "English",
// 			proficiencyLevel: "Native/Bilingual",
// 			canRead: true,
// 			canWrite: true,
// 			canSpeak: true
// 		},
// 		{
// 			language: "Spanish",
// 			proficiencyLevel: "Intermediate",
// 			canRead: true,
// 			canWrite: false,
// 			canSpeak: true
// 		}
// 	],
// 	persona: "Tech Enthusiast",
// 	template: "Modern"
// };
  