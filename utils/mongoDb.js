const makeFieldsRequired = (schema, requiredFields) => {
    
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

// Object.keys(schema.describe().keys) => ["name,description,categories,departments"]
// schema.fork()  this needs an array of strings , and fn to modify each field

export const validationSchema = ({isUpdate=false,baseSchemaValdiation,requiredFields})=>{
    
	const schema = baseSchemaValdiation;

	if(isUpdate){
		// making everything optiona lwhile updating a doc
		schema = schema.fork(Object.keys(schema.describe().keys()), (field)=>{
			field.optional();
		}); 

	}else{
		// making the necessary things required whle creation
		schema = makeFieldsRequired(schema,requiredFields);
	}
	return schema;
};