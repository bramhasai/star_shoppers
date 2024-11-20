const mongoose =require('mongoose');

const sellerSchema = mongoose.Schema({
    seller_id:{
        type:String,
        required:true,
        unique:true
    },
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Products",
        }
    ]
});

const SellerProducts = mongoose.model('SellerProducts',sellerSchema);
module.exports = SellerProducts;

