const express = require('express')
const authRouter = express.Router()
const {validationHelpers} = require('../utils/validation')
const bcrypt = require('bcrypt')
const User = require('../models/user');


authRouter.post('/signup',async (req,res)=>{
try{
    validationHelpers(req)
    const {firstname,lastname,email,password} = req.body
    const passwordhash =  await bcrypt.hash(password, 12)
    const user= new User({firstname,lastname,email,password:passwordhash})
    await user.save()

    const token = await user.getToken()
    res.cookie("token",token)
    res.send(user)
    }
    catch(err){
      res.status(400).send("ERROR: " + err.message)
    }
})

authRouter.post('/login', async (req,res)=>{
    const {email,password} = req.body
    try{
        const user = await User.findOne({email:email})
        if(!user){
            throw new Error ("invalid credentials")
        }
        const ispasswordmatch = await user.isPasswordMatch(password)
        if(ispasswordmatch){
            const token = await user.getToken()
            res.cookie("token",token)
            res.send(user)
        }
        else{
            throw new Error ("invalid credentials")
        }
      
    }
    catch(err){
        console.log("error",err.message)
        res.status(400).send("Error: " + err.message)
    }
})
authRouter.post('/logout', async (req,res)=>{
  res.cookie("token",null,{
    expires : new Date(Date.now())
  })
  res.send("logout successful")
})

module.exports = authRouter