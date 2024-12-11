const multer =require('multer');
const Products =require('../models/allProducts_model');
const SellerProducts = require('../models/sellerProducts_model');

const storage = multer.memoryStorage();
const upload = multer({storage})

const algoliasearch = require('algoliasearch');
const client = algoliasearch('AN5IZ09K1M', '750deda1f27131266eef48792fdcce83');
const index = client.initIndex('products');

//seller
const getMyProducts = async(req,res)=>{
    try{
        const {seller_id} =req.params;
        const seller = await SellerProducts.findOne({seller_id}).populate("products");
        if(!seller){
            console.log("Seller not found");
            return res.status(404).json({message:"Seller not found"});
        }
        const productsWithImages = seller.products.map(product => ({
            ...product._doc, // Spread product fields
            image: product.image ? `data:${product.imageType};base64,${product.image.toString('base64')}` : null,
        }));

        res.status(200).json({ data: productsWithImages });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
}

//seller
const addProducts = async (req, res) => {
    try {
        const { seller_id } = req.params;
        const { title, description, price, discount, category} = req.body;

        if(!req.file){
            return res.status(400).json({message:"Image file is required"})
        }

        let seller = await SellerProducts.findOne({ seller_id });
        if (!seller) {
            seller = new SellerProducts({
                seller_id,
                products: [] 
            });
        }

        const product = new Products({
            title,
            description,
            price,
            discount,
            category,
            image:req.file.buffer,
            imageType:req.file.mimetype,
            seller_id
        });
        const saved_product = await product.save();

        seller.products.push(saved_product._id);

        await seller.save();

        const base64Image = `data:${saved_product.imageType};base64,${saved_product.image.toString('base64')}`;
        // algolia
        await index.saveObject({
            objectID: saved_product._id,
            title: saved_product.title,
            description: saved_product.description,
            price: saved_product.price,
            discount: saved_product.discount,
            category: saved_product.category,
            // image: saved_product.image,
            // imageType : saved_product.imageType,
            image: base64Image,
            seller_id: saved_product.seller_id
        });

        res.status(201).json({ message: "Product added successfully", product: saved_product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

//seller
const updateProduct = async (req, res) => {
    try {
        const { product_id, seller_id } = req.params; // Extract IDs from route parameters
        const { title, description, price, discount, category } = req.body; // Extract updated fields

        const product = await Products.findById(product_id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.seller_id !== seller_id) {
            return res.status(403).json({ message: "Unauthorized: Product does not belong to this seller" });
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discount = discount || product.discount;
        product.category = category || product.category;

        let base64Image = null;
        if (req.file) {
            product.image = req.file.buffer; // Update binary data
            product.imageType = req.file.mimetype; // Update MIME type
            base64Image = `data:${product.imageType};base64,${product.image.toString('base64')}`;
        }

        const updatedProduct = await product.save();

        await index.partialUpdateObject({
            objectID: updatedProduct._id,
            title: updatedProduct.title,
            description: updatedProduct.description,
            price: updatedProduct.price,
            discount: updatedProduct.discount,
            category: updatedProduct.category,
            ...(base64Image && { image: base64Image })
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });



    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

//seller
const deleteProduct = async(req,res)=>{
    try{
        const {seller_id,product_id} = req.params;
        const product = await Products.findByIdAndDelete(product_id);
    
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const seller = await SellerProducts.findOneAndUpdate(
            {seller_id},
            {$pull:{products: product_id}},
            {new :true}
        );

        if(!seller){
            return res.status(404).json({message:"Seller not found"});
        }

        await index.deleteObject(product_id)

        res.status(200).json({message:"Product deleted successfully"});
    }catch(error){
        console.log("Error deleting product : ",error);
        res.status(500).json({message:"Server error",error})
    }
}

//shopper
const getAllProducts = async(req,res)=>{
    try{
        const allProducts = await Products.find();
        const allProductsWithImages = allProducts.map(product => ({
            ...product._doc, // Spread product fields
            image: product.image ? `data:${product.imageType};base64,${product.image.toString('base64')}` : null,
        }));
        res.status(200).json({
            status:'success',
            results: allProductsWithImages.length,
            data : {products: allProductsWithImages}
        });
    }catch(error){
        res.status(500).json({
            status:'error',
            message:"Failed to retrieve products",
            error:error.message
        });
    }  
}


module.exports = [getMyProducts,addProducts,updateProduct,deleteProduct,getAllProducts];