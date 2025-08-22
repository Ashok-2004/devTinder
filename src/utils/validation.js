const validator=require("validator")
const validateSigUpData=(req)=>{
    const {firstName,lastName,email,password}=req.body;
    if(!firstName || !lastName || !email || !password){
        throw new Error("Name is not valid!")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid!")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!")
    }
}
const validateProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","emailId","photoURL","gender","age","about","skills"]
    const isEditAllowed=Object.keys(req.body).every((field)=>allowedEditFields.includes(field))
    return isEditAllowed
}
module.exports={validateSigUpData,validateProfileData}