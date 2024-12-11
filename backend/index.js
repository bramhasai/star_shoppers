const express = require('express')
const app =express();

//database
const connectdb = require('./config/db');
const sellerRoutes = require('./routes/seller_routes');

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));

//express after cors
app.use(express.json());
app.use(sellerRoutes)


//server
app.listen(3000,()=>{
    console.log("Server is listening at port number 3000")
});

//connecting db
connectdb();