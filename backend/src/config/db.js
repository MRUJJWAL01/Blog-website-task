const mongoose = require("mongoose");

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("db is connected");
        
    } catch (error) {
        console.log("error in connecting db",error);
        
    }

}

module.exports = connectDb;