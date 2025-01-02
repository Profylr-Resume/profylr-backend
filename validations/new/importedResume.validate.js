import Joi from "joi";
import { makeFieldsRequired } from "../../utils/mongoDb";


const baseSchemaValdiation = Joi.object({
	fileUrl: Joi.string().uri().trim(),
	fileType: Joi.string().valid("pdf", "doc", "docx"),
	originalfileName: Joi.string().min(3).max(50).trim(),
	fielSize : Joi.number()
});

const requiredFields = [
	"fileUrl",
	"fileType",
	"originalFileName",
	"fileSize"
];

const validationSchema = (isUpdate=false)=>{
    
	const schema = baseSchemaValdiation;

	if(isUpdate){
        
		schema = schema.fork(Object.keys(schema.describe().keys()), (field)=>{
			field.optional();
		}); 

	}else{
		schema = makeFieldsRequired(schema,requiredFields);
	}
	return schema;
};


export const validateImportedResumeForCreation = validationSchema(false);
export const validateImportedResumeForupdate = validationSchema(true);