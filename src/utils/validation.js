const validator = require("validator")
const validationHelpers = (req) =>{
  const {firstname,lastname,email,password} = req.body
  if(!firstname || !email || !password){
    throw new Error("firstname,email and password are required")
  }
  else if(!validator.isEmail(email)){
    throw new Error("Invalid email")
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong enough")
  }
}
const validateEditProfileData = (req) =>{
const allowedEditData = ["firstname","lastname","email","age","gender","photourl","about","skils"]
  const isValidUpdate =  Object.keys(req.body).every((field)=>{
        return allowedEditData.includes(field)
    })
    return isValidUpdate
}
module.exports = {
    validationHelpers,
    validateEditProfileData

}