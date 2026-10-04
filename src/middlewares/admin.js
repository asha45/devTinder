const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userAuth = async (req,res,next) =>{
    try{
      const {token} = req.cookies
     if(!token){
        return res.status(401).send("user should login")
       }  
        const decodedData = await jwt.verify(token,"Devtinder@123#")
        const user = await User.findById(decodedData.id)
        if(!user){
            throw new Error("user not found")
        }
        req.user=user
        next()
     }catch(err){
        res.status(400).send("ERROR: "+ err.message)
     }
}
    
     



module.exports = {
    userAuth
}