import Joi from "joi";

const templateValidation = Joi.object({
	name: Joi.string().optional(), // Optional, as in the provided Joi schema
	description: Joi.string().optional(), // Optional
	html: Joi.string().optional(), // Optional
	sections: Joi.array()
	  .items(
			Joi.object({
		  section: Joi.string().required(), // Aligns with `Schema.Types.ObjectId` (reference)
		  html: Joi.string().required() // Matches the Mongoose schema
			})
	  )
	  .required(), // Ensure sections array is always provided
	thumbnail: Joi.string().optional() // Add this since it exists in the Mongoose schema
});
  

export default templateValidation;