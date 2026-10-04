const mongoose = require ("mongoose")
const validator = require("validator")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema= new mongoose.Schema({
    firstname:{
        type : String,
        required :true,
        maxLength :50
    },
    lastname:{
        type : String
    },
    email :{
        type : String,
        required: true,
        unique:true,
        trim :true,
        lowercase : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid email")
            }
        }

    },
    password:{
        type : String,
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("Password is not strong enough")

            }
        }
    },
    age :{
        type : Number,
        min: 18
    },
    gender :{
        type : String,
        validate(val){
           if(!["male","female","others"].includes(val)) {
               throw new Error("Invalid gender");
           }
        }
    },
    photourl:{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEpJ2tlKg9L7kFUEZv3P9UOhHmYX8SKXJ4LDPc9CVKNXdRPtC7Gysj7CM&s"
    },
    about : {
        type : String,
        default : "Hey there! I am using DevTinder"
    },
    skils : {
        type :[String]
    }

},{timestamps : true})

userSchema.methods.getToken = async function (){
    const user= this;
    const token = await jwt.sign({id:user._id},"Devtinder@123#")

    return token
},
userSchema.methods.isPasswordMatch = async function (passwordfromuser) {
    const user = this;
    return await bcrypt.compare(passwordfromuser, user.password);
},
module.exports = mongoose.model("User",userSchema)