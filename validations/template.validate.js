import Joi from "joi";

const templateValidation = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
	html: Joi.string(),
	sections: Joi.array()
		.items(
			Joi.object({
				section: Joi.object({
					_id: Joi.string().required()
				}),
				html: Joi.string().required()
			})
		)
		.required()
});

export default templateValidation;