const express =require("express")
const sendConnectionRequest = require("../models/sendConnectionRequest")
const { userAuth } = require("../middlewares/admin")
const userRouter =express.Router()
const User = require("../models/user")

const SAFER_DATA = "firstname lastname age gender about photourl"

userRouter.get("/user/request/recieved", userAuth, async (req,res)=>{
    try{
      const loggedinUser = req.user
      const recievedRequests = await sendConnectionRequest.find({
        reciverId : loggedinUser._id,
        status:"interested"
    }).populate("senderId", SAFER_DATA)
    res.json({
        message: "Recieved connection requests",
        requests: recievedRequests
    })
    }
    catch(err){
        res.status(400).send("ERROR " + err.message)
    }

})

userRouter.get("/user/connections" , userAuth , async (req,res)=>{
 try{
    const loggedinUser = req.user
    // asha => veekshha -- accepted
    //veekshha => baji -- acceted -- now veekshha has 2 connections 

    const connections  = await sendConnectionRequest.find({
        $or:[
            {senderId : loggedinUser._id , status:"accepted"},
            {reciverId : loggedinUser._id,status:"accepted"}
        ]
    }).populate("senderId",SAFER_DATA ).populate("reciverId" , SAFER_DATA)

    const mappedData = connections.map((row)=>{
     if(row.senderId._id.toString()===row.reciverId._id.toString()){
        return row.reciverId
     }
     else{
        return row.senderId
     }
    })
    res.json({
        message : `${loggedinUser.firstname} has ${mappedData.length} connections`,
        mappedData
    })

 }catch(err){
    res.status(400).send("ERROR "+ err.message)
 }
})

userRouter.get("/feed",userAuth ,async (req,res)=>{
try{
    const page= parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit>50?50:limit
    const skip = (page-1) * limit
    const loggedinUser = req.user
    const  userConnections = await sendConnectionRequest.find({
        $or:[
            {senderId:loggedinUser._id},{reciverId : loggedinUser._id}
        ]
    }).select("senderId reciverId")
 const hideConnections = new Set()
 userConnections.forEach((req)=>{
    hideConnections.add(req.senderId)
    hideConnections.add(req.reciverId)
 })

 const users = await User .find({
    $and:[
       { _id:{$nin:Array.from(hideConnections)}},
       {_id:{$ne:loggedinUser._id}}
    ]
 }).select(SAFER_DATA).skip(skip).limit(limit)
 res.json({data:users})


}
catch(err){
    res.status(400).send("ERROR " + err.message)
}
})

module.exports = userRouter