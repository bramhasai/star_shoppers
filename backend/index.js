const express = require('express')
const app =express();
//databse
const connectdb = require('./config/db');
const sellerRoutes = require('./routes/seller_routes');
//server
app.listen(3000,()=>{
    console.log("Server is listening at port number 3000")
});

//connecting db
connectdb();