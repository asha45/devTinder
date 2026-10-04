const mongoose = require("mongoose")

const sendConnectionRequest = new mongoose.Schema({
    senderId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref : "User"
   },
   reciverId:{
    required:true,
    type:mongoose.Schema.Types.ObjectId,
    ref : "User"
   },
   status:{
    required:true,
    type:String,
    enum:{
       values: ["accepted","ignored","interested","rejected"],
       message:'{VALUE} is not a valid status'
    }
   }

},{timestamps:true})

sendConnectionRequest.index({senderId:1,reciverId:1})

// sendConnectionRequest.pre("save", function(next){
//   const connectionRequest = this
//   if(connectionRequest.senderId.toString() === connectionRequest.reciverId.toString()){
//     throw new Error("you cannot send connection request to yourself....")
//   }
//   next()
// })

module.exports = mongoose.model("sendConnectionRequest",sendConnectionRequest)