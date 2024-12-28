import Joi from "joi";

const templateValidation = Joi.object({
	name: Joi.string().required("Every template should have a name.") , 
	description: Joi.string().optional(), 
	html: Joi.string().optional(), 
	sections: Joi.array()
	  .items(
			Joi.object({
		        section: Joi.string().required(), // Section ObjectId for reference
		        html: Joi.string().required() 
			})
	  )
	  .required(), // Ensure sections array is always provided
	thumbnail: Joi.string().optional() 
});
  
export default templateValidation;