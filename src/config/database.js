const mongoose = require("mongoose")

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://ashakancheti005_db_user:qQTrJ1J5jzBj0vqk@namastenode.tf4fkrq.mongodb.net/devtinder")
}

module.exports = connectDB