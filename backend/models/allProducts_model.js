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
    image:{
        type:Buffer,
        required:true
    },
    imageType: {
        type: String,
        required:true
    },
    seller_id: {
        type: String,
        required: true,
    }
});

productSchema.virtual('imageSrc').get(function(){
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};base64,${this.image.toString('base64')}`;
    }
});

const Products = mongoose.model('Products',productSchema);
module.exports = Products;