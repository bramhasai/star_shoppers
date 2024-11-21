
const Products =require('../models/allProducts_model');
const SellerProducts = require('../models/sellerProducts_model');

const getMyProducts = async(req,res)=>{
    try{
        const {seller_id} =req.params;
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

const addProducts = async (req, res) => {
    try {
        const { seller_id } = req.params;
        const { title, description, price, discount, category, imageUrl } = req.body;

        // Check if the seller exists
        let seller = await SellerProducts.findOne({ seller_id });

        if (!seller) {
            // If seller doesn't exist, create a new seller
            seller = new SellerProducts({
                seller_id,
                products: [] // Initialize products array
            });
        }

        // Create a new product
        const product = new Products({
            title,
            description,
            price,
            discount,
            category,
            imageUrl,
            seller_id
        });

        // Save the product
        const saved_product = await product.save();

        // Add the product ID to the seller's products array
        seller.products.push(saved_product._id);

        // Save the seller (either newly created or updated)
        await seller.save();

        res.status(201).json({ message: "Product added successfully", product: saved_product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = [getMyProducts,addProducts];