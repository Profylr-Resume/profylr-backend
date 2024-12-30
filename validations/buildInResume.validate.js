import Joi from "joi";
import { makeFieldsRequired } from "../utils/mongoDb";

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
	title:Joi.string(),
	startDate: Joi.string(),
	endDate: Joi.string()
});

// 7
const achievementsAndAwardsValidation = Joi.object({
    
});

// 8
const extraCurricularValidation = Joi.object({
    
});

// 9
const publicationsAndResearchValidation = Joi.object({
    
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
	languagesKnown : Joi.array().items(Joi.string()),

	persona: Joi.string(),
	template: Joi.string()
});

// If you omit a main key (like mainKey1), its required fields won't matter.
// If you include a main key, you must satisfy all its .required() fields.

const requiredFields = [
	// Basic Info
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

	// Experience
	"experiences.organisationName",
	"experiences.position",
	"experiences.from",
	"experiences.description",

	// Projects
	"projects.name",
	"projects.technologiesUsed",
	"projects.from",
	"projects.description",

	// Skills
	"skills.name",
	"skills.category",

	// Persona & Template
	"persona",
	"template"
];

const schemaValidation = (isUpdate=false)=>{
    
	let schema = baseSchemaValidation;

	if(!isUpdate){
		schema = makeFieldsRequired(schema,requiredFields);
	}
	else{
		schema = schema.fork(Object.keys(schema.describe().keys),(field)=>{
			field.optional();
		});
	}
	return schema;
};

export const validateBuildInResumeForCreation = schemaValidation(false); 
export const validateBuildInResumeForUpdate = schemaValidation(true); 

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
  