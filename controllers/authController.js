import USER from "../models/User";


export const userRegister = async(req,res)=>{

	const {name,email,password} = req.body;

	if(!name || !email || !password){
		return res.status(406).json({
			message:"Missing fields",
			data:null
		});
	}

	// need to hash the password
    
	try{
		const newUser = new USER({name,email,password});
		const savedUser = await newUser.save();
		console.log(savedUser);
		return res.status(200).json({
			message:"New user saved"
		});
	}   
	catch(err){
		return res.status(500).json({
			message:`${err.response.message || "Error saving user to database." }`
		});
	}


}; 