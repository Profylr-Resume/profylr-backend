export const makeFieldsRequired = (schema, requiredFields) => {
    
	requiredFields.forEach((fieldPath) => {
		const fieldParts = fieldPath.split(".");
		let currentSchema = schema;
  
		// Traverse through the field path and make each segment of the path required
		fieldParts.forEach((part, index) => {
			if (index === fieldParts.length - 1) {
				// Make the final field in the path required
				currentSchema = currentSchema.keys({
					[part]: currentSchema.extract(part).required()
				});
			} else {
				// Traverse to the nested object
				currentSchema = currentSchema.keys({
					[part]: currentSchema.extract(part)
				});
			}
		});
	});
  
	return schema;
};
  