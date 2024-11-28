const express = require('express');
const [getMyProducts,addProducts,updateProduct,deleteProduct] = require('../controllers/seller_controller');
const sellerRoutes = express.Router();

const multer =require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage})
sellerRoutes.get('/home/:seller_id',getMyProducts);
sellerRoutes.post('/:seller_id/addProducts',upload.single('image'),addProducts)
sellerRoutes.put('/:seller_id/updateProduct/:product_id',upload.single('image'),updateProduct)
sellerRoutes.delete('/:seller_id/deleteProduct/:product_id',deleteProduct)

module.exports = sellerRoutes;