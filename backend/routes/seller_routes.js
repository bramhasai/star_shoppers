const express = require('express');
const [getMyProducts,addProducts,updateProduct,deleteProduct,getAllProducts] = require('../controllers/seller_controller');
const App_Routes = express.Router();

const multer =require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage})
App_Routes.get('/seller/home/:seller_id',getMyProducts);
App_Routes.post('/seller/:seller_id/addProducts',upload.single('image'),addProducts)
App_Routes.put('/seller/:seller_id/updateProduct/:product_id',upload.single('image'),updateProduct)
App_Routes.delete('/seller/:seller_id/deleteProduct/:product_id',deleteProduct)
App_Routes.get('/shopper/:shopper_id/products-home',getAllProducts);
module.exports = App_Routes;