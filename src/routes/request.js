const express = require("express")
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/admin')
const SendConnectionRequest = require("../models/sendConnectionRequest")
const User = require("../models/user")
const sendConnectionRequest = require("../models/sendConnectionRequest")

requestRouter.post("/sendConnectionRequest/request/:status/:userId",userAuth, async (req,res)=>{
    try{

        const senderId = req.user._id
        const reciverId = req.params.userId
        const status = req.params.status

        const allowedStaus = ["interested","ignored"]
        if(!allowedStaus.includes(status)){
            return res.json({
                message:" status should be either interested or ignored"
            })
        }

        const existingRequest = await  SendConnectionRequest.findOne({
            $or:[
                {senderId,reciverId},
                {senderId:reciverId,reciverId:senderId}
            ]
        })
        if(existingRequest){
            return res.json({
                message:"connection request already exists"
            })
            
        }
        const userinDB = await User.findById(reciverId)
        if(!userinDB){
            throw new Error("user not found")
        }
        if(senderId.toString() === reciverId.toString()){
            throw new Error("you cannot send connection request to yourself")
        }
       const request =new SendConnectionRequest({
            senderId,
            reciverId,
            status
        })
        await request.save()
        res.json({
            message: `${req.user.firstname} sent a connection request with status of ${status} in `
        })

    }
    catch(err){
        res.status(400).send("ERROR " + err.message)
    }
    
})
requestRouter.post("/sendConnectionRequest/review/:status/:requestId",userAuth,async (req,res)=>{
 try{
    const loggedinUser = req.user
    const {status,requestId} = req.params
    const allowedStatus = ["accepted","rejected"]
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message: "status should be either accepted or rejected"
        })
    }
    const reviewConnectRequest = await sendConnectionRequest.findOne({
        _id :requestId,
        reciverId :loggedinUser._id,
        status :"interested"
    })
    if(!reviewConnectRequest){
        return res.status(404).json({
            message:"connection not found"
        })
    }

    reviewConnectRequest.status = status
    const data= await reviewConnectRequest.save()
    res.json({
        message: `connection request ${status} successfully`,
        data
    })

 }catch(err){
    res.status(400).send("ERROR " + err.message)
 }
})

module.exports = requestRouter