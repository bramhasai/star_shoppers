const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    seller_id: {
        type: String,
        required: true,
    }
});

const Products = mongoose.model('Products',productSchema);
module.exports = Products;