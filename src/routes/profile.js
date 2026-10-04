const express = require("express")
const profileRouter = express.Router()
const {userAuth} = require('../middlewares/admin')
const {validateEditProfileData} = require('../utils/validation')
const bcrypt = require('bcrypt')

profileRouter.get("/profile/view", userAuth,(req,res)=>{
try{
    res.send(req.user)
}catch(err){
  res.status(400).send("Error : " +err.message)
}
})
profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
  try{
    if(!validateEditProfileData(req)){
      throw new Error ("Invalid update Data")
    }
    const loggedinuser = req.user
    Object.keys(req.body).forEach((field)=>{
      loggedinuser[field] = req.body[field]

    })
    await loggedinuser.save()
    res.json({message: loggedinuser.firstname + " your profile updated successfully", 
    data: loggedinuser})


  }catch(err){
    res.status(400).send("ERROR: " + err.message)
  }

})
profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
  try{
     
    const newpassword  = await bcrypt.hash(req.body.password,12)
    req.user.password = newpassword

     await req.user.save()
     res.send("password updated successfully")

   }
  catch(err){
    res.status(400).send("ERROR: " +err.message)
  }

})

module.exports = profileRouter