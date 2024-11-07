import Joi from "joi";

const resumeSectionValidation = Joi.object({
	name: Joi.string()
		.required(),
	description: Joi.string()
});

export default resumeSectionValidation;