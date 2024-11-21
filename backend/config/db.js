const mongoose = require('mongoose')
require('dotenv').config();
const connectdb =  async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected Successfully");
    }catch(error){
        console.log(error);
    }
}
module.exports = connectdb;
