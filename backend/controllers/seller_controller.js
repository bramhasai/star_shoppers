
const Products =require('../models/allProducts_model');
const SellerProducts = require('../models/sellerProducts_model');

const getMyProducts = async(req,res)=>{
    try{
        const {seller_id} =req.params.seller_id;
        const seller = await SellerProducts.findOne({seller_id}).populate("products");
        if(!seller){
            console.log("Seller not found");
            return res.status(404).json({message:"Seller not found"});
        }
        res.status(200).json({ data: seller.products });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
}

const addProducts = async(req,res)=>{
    try{
        const {seller_id} = req.params;
        const {title,description,price,discount,category,imageUrl} = req.body;

        const seller = await SellerProducts.findOne({seller_id});
        if(!seller){
            return res.status(404).json({message:"Seller not found"});
        }
        const product = new Products({
            title,
            description,
            price,
            discount,
            category,
            imageUrl,
            seller_id
        })
        const saved_product = await product.save();
        seller.products.push(saved_product._id);
        await seller.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }

}

module.exports = [getMyProducts,addProducts];